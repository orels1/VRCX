﻿using CefSharp;

namespace VRCX
{
    public static class Util
    {
        public static void ApplyJavascriptBindings(IJavascriptObjectRepository repository)
        {
            repository.NameConverter = null;
            repository.Register("AppApi", AppApi.Instance, true);
            repository.Register("SharedVariable", SharedVariable.Instance, true);
            repository.Register("WebApi", WebApi.Instance, true);
            repository.Register("VRCXStorage", VRCXStorage.Instance, true);
            repository.Register("SQLite", SQLite.Instance, true);
            repository.Register("LogWatcher", LogWatcher.Instance, true);
            repository.Register("Discord", Discord.Instance, true);
        }
    }
}
