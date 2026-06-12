// import { TextFormControl, TextFormControlOption } from './../text-form-control/text-form-control';
// import {
//   required,
//   minLength,
//   maxLength,
// } from '@angular/forms/signals';
// import { FormControlBase } from '../form-control-base/form-control-base';

// export function signalFormSchema(controls: FormControlBase[]) {
//   return (path: any) => {
//     for (const c of controls) {
//       const field = path[c.key];

//       if (c.options?.required) {
//         required(field);
//       }

//       switch(c.type) {
//         case 'text':
//         case 'textarea':
//           const textFCOption = c.options as TextFormControlOption;

//           if (textFCOption.minlength != null) {
//             minLength(field, textFCOption.minlength);
//           }

//           if (textFCOption.maxlength != null) {
//             maxLength(field, textFCOption.maxlength);
//           }
//           break;
//         // case 'number':
//         // case 'dropdown':
//         // case 'checkbox':
//         // case 'date':
//       }


//     }
//   };
// }
