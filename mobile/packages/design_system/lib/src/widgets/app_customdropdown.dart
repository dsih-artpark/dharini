// import 'package:flutter/material.dart';

// class CustomDropdown extends StatelessWidget {
//   const CustomDropdown({
//     required this.items,
//     required this.value,
//     required this.onChanged,
//     super.key,
//     this.hint,
//     this.width = 200,
//     this.height,
//     this.borderRadius = 25,
//     this.borderColor = Colors.grey,
//     this.backgroundColor = Colors.white,
//     this.textStyle,
//     this.hintStyle,
//     this.prefixIcon,
//     this.suffixIcon,
//   });

//   /// List of items to be displayed in the dropdown.
//   final List<String> items;

//   /// Currently selected value.
//   final String value;

//   /// Callback triggered when a new value is selected.
//   final ValueChanged<String?> onChanged;

//   /// Optional hint text to display when no value is selected.
//   final String? hint;

//   /// Width of the dropdown container.
//   final double width;

//   /// Optional height of the dropdown container.
//   final double? height;

//   /// Border radius of the dropdown container.
//   final double borderRadius;

//   /// Border color of the dropdown container.
//   final Color borderColor;

//   /// Background color of the dropdown container.
//   final Color backgroundColor;

//   /// Text style for dropdown items.
//   final TextStyle? textStyle;

//   /// Text style for the hint.
//   final TextStyle? hintStyle;

//   /// Optional prefix icon to be shown before the text.
//   final Widget? prefixIcon;

//   /// Optional suffix icon to be shown after the text.
//   final Widget? suffixIcon;

//   @override
//   Widget build(BuildContext context) => Container(
//         width: width,
//         height: height,
//         padding: const EdgeInsets.symmetric(horizontal: 8),
//         decoration: BoxDecoration(
//           border: Border.all(color: borderColor),
//           borderRadius: BorderRadius.circular(borderRadius),
//           color: backgroundColor,
//         ),
//         child: DropdownButtonHideUnderline(
//           child: DropdownButton<String>(
//             value: value.isNotEmpty ? value : null,
//             hint: hint != null ? Text(hint!, style: hintStyle) : null,
//             isExpanded: true,
//             icon: const Icon(Icons.arrow_drop_down),
//             items: _buildDropdownItems(),
//             onChanged: onChanged,
//             style: textStyle,
//             selectedItemBuilder: (BuildContext context) => items.map<Widget>((String item) => Row(
//                   children: <Widget>[
//                     if (prefixIcon != null) ...<Widget>[
//                       prefixIcon!,
//                       const SizedBox(width: 8),
//                     ],
//                     Text(item, style: textStyle),
//                     if (suffixIcon != null) ...<Widget>[
//                       const SizedBox(width: 8),
//                       suffixIcon!,
//                     ],
//                   ],
//                 ),).toList(),
//           ),
//         ),
//       );

//   /// Builds the list of dropdown menu items.
//   List<DropdownMenuItem<String>> _buildDropdownItems() => items.map((String item) => DropdownMenuItem<String>(
//           value: item,
//           child: Row(
//             children: <Widget>[
//               if (prefixIcon != null) ...<Widget>[
//                 prefixIcon!,
//                 const SizedBox(width: 8),
//               ],
//               Text(item, style: textStyle),
//               if (suffixIcon != null) ...<Widget>[
//                 const SizedBox(width: 8),
//                 suffixIcon!,
//               ],
//             ],
//           ),
//         ),).toList();
// }
