#include <windows.h>
#include <d3d11.h>
#include <stdint.h>
#include <stdlib.h>
#include <stdio.h>
#include <napi.h>

#include "../deps/openvr/headers/openvr.h"

Napi::Value sample(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();

    printf("sample called yo?\n");

    return Napi::Value::From(env, "ok");
}

Napi::Value sum(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();
    double sum = 0;

    for (size_t i = info.Length(); i > 0; --i)
    {
        sum += info[i - 1].ToNumber().DoubleValue();
    }

    return Napi::Value::From(env, sum);
}

static LONG overlay_flag_;
static uint8_t overlay_data_[512 * 512 * 4];

Napi::Value setFrameBuffer(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();

    if (info.Length() != 2)
    {
        return Napi::Value::From(env, -1);
    }

    // int32_t id = info[0].ToNumber();

    Napi::Buffer<uint8_t> bitmap = info[1].As<Napi::Buffer<uint8_t>>();
    if (bitmap.Length() != 512 * 512 * 4)
    {
        return Napi::Value::From(env, -3);
    }

    if (overlay_flag_ == 0)
    {
        memcpy(overlay_data_, bitmap.Data(), 512 * 512 * 4);
        overlay_flag_ = 1;
    }

    return Napi::Value::From(env, 0);
}

ID3D11Device *pDevice;
ID3D11DeviceContext *pImmediateContext;
ID3D11Texture2D *pTexture1;
ID3D11Texture2D *pTexture2;

DWORD __stdcall thread_proc(void *args)
{
    HRESULT hr;

    hr = D3D11CreateDevice(
        NULL,
        D3D_DRIVER_TYPE_HARDWARE,
        NULL,
        D3D11_CREATE_DEVICE_SINGLETHREADED,
        NULL,
        0,
        D3D11_SDK_VERSION,
        &pDevice,
        NULL,
        &pImmediateContext);

    if (pDevice == NULL)
    {
        printf("D3D11CreateDevice(): hr=%d\n", hr);
        return 0;
    }

    D3D11_TEXTURE2D_DESC texDesc;
    texDesc.Width = 512;
    texDesc.Height = 512;
    texDesc.MipLevels = 1;
    texDesc.ArraySize = 1;
    texDesc.Format = DXGI_FORMAT_B8G8R8A8_UNORM;
    texDesc.SampleDesc.Count = 1;
    texDesc.SampleDesc.Quality = 0;
    texDesc.Usage = D3D11_USAGE_DEFAULT;
    texDesc.BindFlags = D3D11_BIND_SHADER_RESOURCE;
    texDesc.CPUAccessFlags = 0;
    texDesc.MiscFlags = 0;

    hr = pDevice->CreateTexture2D(&texDesc, NULL, &pTexture1);
    if (pTexture1 == NULL)
    {
        printf("CreateTexture2D(): hr=%d\n", hr);
        return 0;
    }

    hr = pDevice->CreateTexture2D(&texDesc, NULL, &pTexture2);
    if (pTexture2 == NULL)
    {
        printf("CreateTexture2D(): hr=%d\n", hr);
        return 0;
    }

    int textureIndex = 0;

    while (true)
    {
        auto pVRSystem = vr::VRSystem();
        if (pVRSystem == NULL)
        {
            vr::EVRInitError initError = vr::EVRInitError::VRInitError_None;

            pVRSystem = vr::VR_Init(&initError, vr::EVRApplicationType::VRApplication_Overlay);

            if (initError != vr::EVRInitError::VRInitError_None)
            {
                printf("vr::VR_Init(): %d\n", initError);
                Sleep(5000);
                continue;
            }
        }

        vr::VREvent_t event;
        while (pVRSystem->PollNextEvent(&event, sizeof(event)))
        {
            printf("event: %d\n", event.eventType);
        }

        auto pVROverlay = vr::VROverlay();
        if (pVROverlay == NULL)
        {
            printf("pVROverlay NULL\n");
            Sleep(1000);
            continue;
        }

        vr::VROverlayHandle_t overlayHandle = vr::k_ulOverlayHandleInvalid;
        vr::EVROverlayError overlayError = pVROverlay->FindOverlay("vrcx_overlay", &overlayHandle);
        if (overlayError != vr::EVROverlayError::VROverlayError_None)
        {
            printf("create\n");

            if (overlayError != vr::EVROverlayError::VROverlayError_UnknownOverlay)
            {
                printf("pVROverlay->FindOverlay(): %d\n", overlayError);
                Sleep(1000);
                continue;
            }

            overlayError = pVROverlay->CreateOverlay("vrcx_overlay", "vrcx_overlay", &overlayHandle);
            if (overlayError != vr::EVROverlayError::VROverlayError_None)
            {
                printf("pVROverlay->CreateOverlay(): %d\n", overlayError);
                Sleep(1000);
                continue;
            }

            // pVROverlay->SetOverlayAlpha(overlayHandle, 0.9f);
            pVROverlay->SetOverlayWidthInMeters(overlayHandle, 1.0f);
            pVROverlay->SetOverlayInputMethod(overlayHandle, vr::VROverlayInputMethod::VROverlayInputMethod_None);
        }

        if (overlay_flag_ == 1)
        {
            pImmediateContext->UpdateSubresource(
                pTexture1,
                0,
                NULL,
                overlay_data_,
                512 * 4,
                0);

            vr::Texture_t texture;
            texture.handle = (void *)pTexture1;
            texture.eType = vr::ETextureType::TextureType_DirectX;
            texture.eColorSpace = vr::EColorSpace::ColorSpace_Auto;

            overlayError = pVROverlay->SetOverlayTexture(overlayHandle, &texture);
            if (overlayError != vr::EVROverlayError::VROverlayError_None)
            {
                printf("pVROverlay->SetOverlayTexture(): %d\n", overlayError);
            }

            pImmediateContext->Flush();

            overlay_flag_ = 0;
        }

        Sleep(1000 / 30);
    }

    return 0;
}

Napi::Object init(Napi::Env env, Napi::Object exports)
{
    CloseHandle(CreateThread(NULL, 0, thread_proc, NULL, 0, NULL));
    exports.Set(Napi::Value::From(env, "sample"), Napi::Function::New(env, sample));
    exports.Set(Napi::Value::From(env, "sum"), Napi::Function::New(env, sum));
    exports.Set(Napi::Value::From(env, "setFrameBuffer"), Napi::Function::New(env, setFrameBuffer));
    return exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, init);
