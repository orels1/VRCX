#include "common.h"
#include "addon.h"

NAPI_MODULE_INIT()
{
    return create_addon(env);
}
