class PendingVisit {
  PendingVisit({
    required this.name,
    required this.location,
    required this.date,
    required this.time,
    required this.completedVisits,
    required this.totalVisits,
    required this.isOverdue,
  });
  final String name;
  final String location;
  final String date;
  final String time;
  final int completedVisits;
  final int totalVisits;
  final bool isOverdue;
}
