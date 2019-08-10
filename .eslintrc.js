module.exports = {
  "root": true,
  "parser": "@typescript-eslint/parser",
  "plugins": [
    "import",
    "flowtype",
    "jsx-a11y",
    "react",
    "react-hooks",
    "@typescript-eslint",
    "no-for-of-loops"
  ],
  "env": {
    "browser": true,
    "commonjs": true,
    "es6": true,
    "jest": true,
    "node": true
  },
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    },
    "warnOnUnsupportedTypeScriptVersion": true
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  },
  "rules": {
    "array-callback-return": "warn",
    "default-case": "off",
    "dot-location": [
      "warn",
      "property"
    ],
    "eqeqeq": [
      "warn",
      "smart"
    ],
    "new-parens": "warn",
    "no-array-constructor": "off",
    "no-caller": "warn",
    "no-cond-assign": [
      "warn",
      "except-parens"
    ],
    "no-const-assign": "warn",
    "no-control-regex": "warn",
    "no-delete-var": "warn",
    "no-dupe-args": "warn",
    "no-dupe-class-members": "off",
    "no-dupe-keys": "warn",
    "no-duplicate-case": "warn",
    "no-empty-character-class": "warn",
    "no-empty-pattern": "warn",
    "no-eval": "warn",
    "no-ex-assign": "warn",
    "no-extend-native": "warn",
    "no-extra-bind": "warn",
    "no-extra-label": "warn",
    "no-fallthrough": "warn",
    "no-func-assign": "warn",
    "no-implied-eval": "warn",
    "no-invalid-regexp": "warn",
    "no-iterator": "warn",
    "no-label-var": "warn",
    "no-labels": [
      "warn",
      {
        "allowLoop": true,
        "allowSwitch": false
      }
    ],
    "no-lone-blocks": "warn",
    "no-loop-func": "warn",
    "no-mixed-operators": [
      "warn",
      {
        "groups": [
          [
            "&",
            "|",
            "^",
            "~",
            "<<",
            ">>",
            ">>>"
          ],
          [
            "==",
            "!=",
            "===",
            "!==",
            ">",
            ">=",
            "<",
            "<="
          ],
          [
            "&&",
            "||"
          ],
          [
            "in",
            "instanceof"
          ]
        ],
        "allowSamePrecedence": false
      }
    ],
    "no-multi-str": "warn",
    "no-native-reassign": "warn",
    "no-negated-in-lhs": "warn",
    "no-new-func": "warn",
    "no-new-object": "warn",
    "no-new-symbol": "warn",
    "no-new-wrappers": "warn",
    "no-obj-calls": "warn",
    "no-octal": "warn",
    "no-octal-escape": "warn",
    "no-redeclare": "warn",
    "no-regex-spaces": "warn",
    "no-restricted-syntax": [
      "warn",
      "WithStatement"
    ],
    "no-script-url": "warn",
    "no-self-assign": "warn",
    "no-self-compare": "warn",
    "no-sequences": "warn",
    "no-shadow-restricted-names": "warn",
    "no-sparse-arrays": "warn",
    "no-template-curly-in-string": "warn",
    "no-this-before-super": "warn",
    "no-throw-literal": "warn",
    "no-undef": "error",
    "no-restricted-globals": [
      "error",
      "addEventListener",
      "blur",
      "close",
      "closed",
      "confirm",
      "defaultStatus",
      "defaultstatus",
      "event",
      "external",
      "find",
      "focus",
      "frameElement",
      "frames",
      "history",
      "innerHeight",
      "innerWidth",
      "length",
      "location",
      "locationbar",
      "menubar",
      "moveBy",
      "moveTo",
      "name",
      "onblur",
      "onerror",
      "onfocus",
      "onload",
      "onresize",
      "onunload",
      "open",
      "opener",
      "opera",
      "outerHeight",
      "outerWidth",
      "pageXOffset",
      "pageYOffset",
      "parent",
      "print",
      "removeEventListener",
      "resizeBy",
      "resizeTo",
      "screen",
      "screenLeft",
      "screenTop",
      "screenX",
      "screenY",
      "scroll",
      "scrollbars",
      "scrollBy",
      "scrollTo",
      "scrollX",
      "scrollY",
      "self",
      "status",
      "statusbar",
      "stop",
      "toolbar",
      "top"
    ],
    "no-unexpected-multiline": "warn",
    "no-unreachable": "warn",
    "no-unused-expressions": [
      "error",
      {
        "allowShortCircuit": true,
        "allowTernary": true,
        "allowTaggedTemplates": true
      }
    ],
    "no-unused-labels": "warn",
    "no-unused-vars": "off",
    "no-use-before-define": [
      "warn",
      {
        "functions": false,
        "classes": false,
        "variables": false
      }
    ],
    "no-useless-computed-key": "warn",
    "no-useless-concat": "warn",
    "no-useless-constructor": "off",
    "no-useless-escape": "warn",
    "no-useless-rename": [
      "warn",
      {
        "ignoreDestructuring": false,
        "ignoreImport": false,
        "ignoreExport": false
      }
    ],
    "no-with": "warn",
    "no-whitespace-before-property": "warn",
    "react-hooks/exhaustive-deps": "warn",
    "require-yield": "warn",
    "rest-spread-spacing": [
      "warn",
      "never"
    ],
    "strict": [
      "warn",
      "never"
    ],
    "unicode-bom": [
      "warn",
      "never"
    ],
    "use-isnan": "warn",
    "valid-typeof": "warn",
    "no-restricted-properties": [
      "error",
      {
        "object": "require",
        "property": "ensure",
        "message": "Please use import() instead. More info: https://facebook.github.io/create-react-app/docs/code-splitting"
      },
      {
        "object": "System",
        "property": "import",
        "message": "Please use import() instead. More info: https://facebook.github.io/create-react-app/docs/code-splitting"
      }
    ],
    "getter-return": "warn",
    "import/first": "error",
    "import/no-amd": "error",
    "import/no-webpack-loader-syntax": "error",
    "react/forbid-foreign-prop-types": [
      "warn",
      {
        "allowInPropTypes": true
      }
    ],
    "react/jsx-no-comment-textnodes": "warn",
    "react/jsx-no-duplicate-props": [
      "warn",
      {
        "ignoreCase": true
      }
    ],
    "react/jsx-no-target-blank": "warn",
    "react/jsx-no-undef": "error",
    "react/jsx-pascal-case": [
      "warn",
      {
        "allowAllCaps": true,
        "ignore": []
      }
    ],
    "react/jsx-uses-react": "warn",
    "react/jsx-uses-vars": "warn",
    "react/no-danger-with-children": "warn",
    "react/no-direct-mutation-state": "warn",
    "react/no-is-mounted": "warn",
    "react/no-typos": "error",
    "react/react-in-jsx-scope": "error",
    "react/require-render-return": "error",
    "react/style-prop-object": "warn",
    "jsx-a11y/accessible-emoji": "warn",
    "jsx-a11y/alt-text": "warn",
    "jsx-a11y/anchor-has-content": "warn",
    "jsx-a11y/anchor-is-valid": [
      "warn",
      {
        "aspects": [
          "noHref",
          "invalidHref"
        ]
      }
    ],
    "jsx-a11y/aria-activedescendant-has-tabindex": "warn",
    "jsx-a11y/aria-props": "warn",
    "jsx-a11y/aria-proptypes": "warn",
    "jsx-a11y/aria-role": "warn",
    "jsx-a11y/aria-unsupported-elements": "warn",
    "jsx-a11y/heading-has-content": "warn",
    "jsx-a11y/iframe-has-title": "warn",
    "jsx-a11y/img-redundant-alt": "warn",
    "jsx-a11y/no-access-key": "warn",
    "jsx-a11y/no-distracting-elements": "warn",
    "jsx-a11y/no-redundant-roles": "warn",
    "jsx-a11y/role-has-required-aria-props": "warn",
    "jsx-a11y/role-supports-aria-props": "warn",
    "jsx-a11y/scope": "warn",
    "react-hooks/rules-of-hooks": "error",
    "flowtype/define-flow-type": "warn",
    "flowtype/require-valid-file-annotation": "warn",
    "flowtype/use-flow-type": "warn",
    "@typescript-eslint/no-angle-bracket-type-assertion": "warn",
    "@typescript-eslint/no-array-constructor": "warn",
    "@typescript-eslint/no-namespace": "error",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        "args": "none",
        "ignoreRestSiblings": true
      }
    ],
    "@typescript-eslint/no-useless-constructor": "warn"
  },
  "extends": [
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended"
  ]
}