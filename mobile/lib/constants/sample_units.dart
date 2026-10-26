/// Shared sample unit constants — mirrors SAMPLE_UNITS from the web app.
class SampleUnit {
  final String value;
  final String label;

  const SampleUnit({required this.value, required this.label});
}

const List<SampleUnit> kSampleUnits = [
  SampleUnit(value: 'L', label: 'L (litre)'),
  SampleUnit(value: 'mL', label: 'mL (millilitre)'),
  SampleUnit(value: 'µL', label: 'µL (microlitre)'),
  SampleUnit(value: 'g', label: 'g (gram)'),
  SampleUnit(value: 'mg', label: 'mg (milligram)'),
  SampleUnit(value: 'µg', label: 'µg (microgram)'),
  SampleUnit(value: 'pcs', label: 'pcs (pieces)'),
];
