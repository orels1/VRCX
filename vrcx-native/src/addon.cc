#include "common.h"
#include "addon.h"

napi_value sample(napi_env env, napi_callback_info info)
{
    napi_value result;

    printf("sample called yo?\n");

    napi_create_string_utf8(env, "ok", NAPI_AUTO_LENGTH, &result);

    return result;
}

napi_value sum(napi_env env, napi_callback_info info)
{
    double sum, value;
    size_t argc;
    napi_value *argv;
    napi_value result;

    sum = 0;

    napi_get_cb_info(env, info, &argc, NULL, NULL, NULL);
    if (argc > 0)
    {
        argv = (napi_value *)malloc(sizeof(napi_value) * argc);
        napi_get_cb_info(env, info, &argc, argv, NULL, NULL);
        for (size_t i = 0; i < argc; ++i)
        {
            if (napi_get_value_double(env, argv[i], &value) == napi_ok)
            {
                sum += value;
            }
        }
        free(argv);
    }

    napi_create_double(env, sum, &result);

    return result;
}

napi_value create_addon(napi_env env)
{
    napi_status status;
    napi_value result;
    napi_value value;

    status = napi_create_object(env, &result);
    if (status != napi_ok)
    {
        return NULL;
    }

    status = napi_create_function(env, NULL, 0, sample, NULL, &value);
    if (status != napi_ok)
    {
        return NULL;
    }

    status = napi_set_named_property(env, result, "sample", value);
    if (status != napi_ok)
    {
        return NULL;
    }

    status = napi_create_function(env, NULL, 0, sum, NULL, &value);
    if (status != napi_ok)
    {
        return NULL;
    }

    status = napi_set_named_property(env, result, "sum", value);
    if (status != napi_ok)
    {
        return NULL;
    }

    return result;
}
