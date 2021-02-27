{
  'variables': {
    'module_name': 'vrcx_native',
    'module_path': './build'
  },
  'targets': [
    {
      'target_name': '<(module_name)',
      'sources': [
        'src/main.cc',
        'src/addon.cc'
      ],
      'include_dirs': [
        '../deps/openvr/headers'
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
                      'files': [
                        '<(module_root_dir)/deps/openvr/bin/win64/openvr_api.dll'
                      ],
                      'destination': '<(module_path)'
                    }
                  ]
                }
              ]
            ]
          }
        ]
      ]
    },
    {
      'target_name': 'action_after_build',
      'type': 'none',
      'dependencies': [
        '<(module_name)'
      ],
      'copies': [
        {
          'files': [
            '<(PRODUCT_DIR)/<(module_name).node',
          ],
          'destination': '<(module_path)'
        }
      ]
    }
  ]
}
