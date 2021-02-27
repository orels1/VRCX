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
      ],
      'include_dirs': [
        '<!(node -p "require(\'node-addon-api\').include_dir")'
      ],
      'cflags!': [
        '-fno-exceptions'
      ],
      'cflags_cc!': [
        '-fno-exceptions'
      ],
      'xcode_settings': {
        'GCC_ENABLE_CPP_EXCEPTIONS': 'YES',
        'CLANG_CXX_LIBRARY': 'libc++',
        'MACOSX_DEPLOYMENT_TARGET': '10.7',
      },
      'msvs_settings': {
        'VCCLCompilerTool': {
          'ExceptionHandling': 1
        },
      },
      'defines': [
        'NAPI_DISABLE_CPP_EXCEPTIONS'
      ],
      'conditions': [
        [
          'OS == "mac"',
          {
            'cflags+': [
              '-fvisibility=hidden'
            ],
            'xcode_settings': {
              'GCC_SYMBOLS_PRIVATE_EXTERN': 'YES', # -fvisibility=hidden
            }
          }
        ],
        [
          'OS == "win"',
          {
            'conditions': [
              [
                'target_arch == "x64"',
                {
                  'libraries': [
                    'd3d11.lib',
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
