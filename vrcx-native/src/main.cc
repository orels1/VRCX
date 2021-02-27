#include <stdio.h>
#include <stdlib.h>
#include <napi.h>

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

Napi::Object Init(Napi::Env env, Napi::Object exports)
{
    exports.Set(Napi::Value::From(env, "sample"), Napi::Function::New(env, sample));
    exports.Set(Napi::Value::From(env, "sum"), Napi::Function::New(env, sum));
    return exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init);
