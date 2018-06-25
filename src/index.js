import {
  css,
  injectGlobal,
  isStyledComponent,
  ThemeProvider,
  withTheme,
  ServerStyleSheet,
  StyleSheetManager,
} from 'styled-components';
import createStyledNativeComponent from 'styled-components/lib/models/StyledNativeComponent';
import createConstructWithOptions from 'styled-components/lib/constructors/constructWithOptions';
import domElements from 'styled-components/lib/utils/domElements';
import createMailStyle from './mail-style';
import ParentComponent from './styled-component';
import StyleSheet from './stylesheet';

const InlineStyle = createMailStyle(StyleSheet);
const constructWithOptions = createConstructWithOptions(css);
const createStyledComponent = createStyledNativeComponent(
  constructWithOptions,
  InlineStyle,
);
const styled = element =>
  constructWithOptions(createStyledComponent, element, { ParentComponent });

// Set html element aliases
domElements.concat('center').forEach(element =>
  Object.defineProperty(styled, element, {
    enumerable: true,
    configurable: false,
    get() {
      return styled(element);
    },
  }),
);

// Set VML (v:*), WML (w:*) and Office (o:*) dynamic aliases
['vml', 'wml', 'office'].forEach(namespace => {
  Object.defineProperty(styled, namespace, {
    enumerable: true,
    configurable: false,
    get() {
      const target = {};
      return new Proxy(target, {
        get(object, property) {
          if (property in object) {
            return object[property];
          }
          if (typeof property === 'string') {
            return styled(`${namespace.charAt(0)}:${property}`);
          }
          return undefined;
        },
      });
    },
  });
});

export default styled;
export {
  css,
  injectGlobal,
  isStyledComponent,
  ThemeProvider,
  withTheme,
  ServerStyleSheet,
  StyleSheetManager,
};
