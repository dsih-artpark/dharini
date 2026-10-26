import 'package:intl/intl.dart';

extension DatetimeExtension on DateTime {
  static DateFormat _humanDateFormat = DateFormat('dd MMM');
  static DateFormat _humanTimeFormat = DateFormat("hh:mm a");

  String get humanDate => _humanDateFormat.format(this);

  String get humanTime => _humanTimeFormat.format(this);
}
