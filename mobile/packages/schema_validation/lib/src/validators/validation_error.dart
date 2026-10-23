class ValidationError {
  const ValidationError(this.message, {this.field, this.value});
  final String message;
  final String? field;
  final dynamic value;

  @override
  String toString() => field != null
      ? 'ValidationError: $message (field: $field, value: $value)'
      : 'ValidationError: $message';
}
