class Getvisitlistmodel {
  bool? success;
  String? message;
  Data? data;

  Getvisitlistmodel({this.success, this.message, this.data});

  Getvisitlistmodel.fromJson(Map<String, dynamic> json) {
    success = json['success'];
    message = json['message'];
    data = json['data'] != null ? new Data.fromJson(json['data']) : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['success'] = this.success;
    data['message'] = this.message;
    if (this.data != null) {
      data['data'] = this.data!.toJson();
    }
    return data;
  }
}

class Data {
  List<Docs>? docs;
  int? total;
  int? page;
  int? limit;
  int? totalPages;

  Data({this.docs, this.total, this.page, this.limit, this.totalPages});

  Data.fromJson(Map<String, dynamic> json) {
    if (json['docs'] != null) {
      docs = <Docs>[];
      json['docs'].forEach((v) {
        docs!.add(new Docs.fromJson(v));
      });
    }
    total = json['total'];
    page = json['page'];
    limit = json['limit'];
    totalPages = json['totalPages'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    if (this.docs != null) {
      data['docs'] = this.docs!.map((v) => v.toJson()).toList();
    }
    data['total'] = this.total;
    data['page'] = this.page;
    data['limit'] = this.limit;
    data['totalPages'] = this.totalPages;
    return data;
  }
}

class Docs {
  String? id;
  String? visitScheduledAt;
  String? visitStatus;
  Site? site;
  int? totalSamples;
  List<Null>? diseaseShortNames;

  Docs(
      {this.id,
      this.visitScheduledAt,
      this.visitStatus,
      this.site,
      this.totalSamples,
      this.diseaseShortNames});

  Docs.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    visitScheduledAt = json['visitScheduledAt'];
    visitStatus = json['visitStatus'];
    site = json['site'] != null ? new Site.fromJson(json['site']) : null;
    totalSamples = json['totalSamples'];
    // if (json['diseaseShortNames'] != null) {
    //   diseaseShortNames = <Null>[];
    //   json['diseaseShortNames'].forEach((v) {
    //     diseaseShortNames!.add(new Null.fromJson(v));
    //   });
    // }
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['id'] = this.id;
    data['visitScheduledAt'] = this.visitScheduledAt;
    data['visitStatus'] = this.visitStatus;
    if (this.site != null) {
      data['site'] = this.site!.toJson();
    }
    data['totalSamples'] = this.totalSamples;
    // if (this.diseaseShortNames != null) {
    //   data['diseaseShortNames'] =
    //       this.diseaseShortNames!.map((v) => v.toJson()).toList();
    // }
    return data;
  }
}

class Site {
  String? collectionTime;

  Site({this.collectionTime});

  Site.fromJson(Map<String, dynamic> json) {
    collectionTime = json['collectionTime'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['collectionTime'] = this.collectionTime;
    return data;
  }
}
