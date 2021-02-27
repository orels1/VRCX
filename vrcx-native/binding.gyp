{
  'targets': [
    {
      'target_name': 'vrcx_native',
      'type': 'static_library',
      'sources': [
        'src/main.cc',
        'src/addon.cc'
      ],
      'include_dirs': [
        'deps/openvr/headers'
      ],
      'conditions': [
        [
          'OS == "win"',
          {
            'conditions': [
              [
                'target_arch == "x64"',
                {
                  'libraries': [
                    '../deps/openvr/lib/win64/openvr_api.lib'
                  ],
                  'copies': [
                    {
                      'destination': '<(module_root_dir)/build/Release/',
                      'files': [
                        '<(module_root_dir)/deps/openvr/bin/win64/openvr_api.dll'
                      ]
                    }
                  ]
                }
              ]
            ]
          }
        ]
      ]
    }
  ]
}
