class CreatesiteModel {
  bool? success;
  String? message;
  Data? data;

  CreatesiteModel({this.success, this.message, this.data});

  CreatesiteModel.fromJson(Map<String, dynamic> json) {
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
  String? id;
  String? name;
  String? siteCode;
  Null collectionConsent;
  int? collectionFrequencyInterval;
  int? collectionFrequency;
  List<String>? collectionDayOfWeek;
  String? collectionTime;
  String? collectionStartDate;
  Null collectionLastScheduleDate;
  int? collectionDuration;
  String? collectionExpiryDate;
  List<Null>? photos;
  String? farmType;
  String? siteType;
  String? siteOwnerName;
  String? siteOwnerNumber;
  int? workerNumber;
  String? address;
  String? district;
  String? state;
  int? pinCode;
  Coordinates? coordinates;
  String? comment;
  int? status;
  String? testResult;
  String? createdAt;
  String? updatedAt;
  List<Null>? collectionCollectors;
  List<Diseases>? diseases;

  Data(
      {this.id,
      this.name,
      this.siteCode,
      this.collectionConsent,
      this.collectionFrequencyInterval,
      this.collectionFrequency,
      this.collectionDayOfWeek,
      this.collectionTime,
      this.collectionStartDate,
      this.collectionLastScheduleDate,
      this.collectionDuration,
      this.collectionExpiryDate,
      this.photos,
      this.farmType,
      this.siteType,
      this.siteOwnerName,
      this.siteOwnerNumber,
      this.workerNumber,
      this.address,
      this.district,
      this.state,
      this.pinCode,
      this.coordinates,
      this.comment,
      this.status,
      this.testResult,
      this.createdAt,
      this.updatedAt,
      this.collectionCollectors,
      this.diseases});

  Data.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    name = json['name'];
    siteCode = json['siteCode'];
    collectionConsent = json['collectionConsent'];
    collectionFrequencyInterval = json['collectionFrequencyInterval'];
    collectionFrequency = json['collectionFrequency'];
    collectionDayOfWeek = json['collectionDayOfWeek'].cast<String>();
    collectionTime = json['collectionTime'];
    collectionStartDate = json['collectionStartDate'];
    collectionLastScheduleDate = json['collectionLastScheduleDate'];
    collectionDuration = json['collectionDuration'];
    collectionExpiryDate = json['collectionExpiryDate'];
    // if (json['photos'] != null) {
    //   photos = <Null>[];
    //   json['photos'].forEach((v) {
    //     photos!.add(new Null.fromJson(v));
    //   });
    // }
    farmType = json['farmType'];
    siteType = json['siteType'];
    siteOwnerName = json['siteOwnerName'];
    siteOwnerNumber = json['siteOwnerNumber'];
    workerNumber = json['workerNumber'];
    address = json['address'];
    district = json['district'];
    state = json['state'];
    pinCode = json['pinCode'];
    coordinates = json['coordinates'] != null
        ? new Coordinates.fromJson(json['coordinates'])
        : null;
    comment = json['comment'];
    status = json['status'];
    testResult = json['testResult'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    // if (json['collectionCollectors'] != null) {
    //   collectionCollectors = <Null>[];
    //   json['collectionCollectors'].forEach((v) {
    //     collectionCollectors!.add(new Null.fromJson(v));
    //   });
    // }
    if (json['diseases'] != null) {
      diseases = <Diseases>[];
      json['diseases'].forEach((v) {
        diseases!.add(new Diseases.fromJson(v));
      });
    }
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['id'] = this.id;
    data['name'] = this.name;
    data['siteCode'] = this.siteCode;
    data['collectionConsent'] = this.collectionConsent;
    data['collectionFrequencyInterval'] = this.collectionFrequencyInterval;
    data['collectionFrequency'] = this.collectionFrequency;
    data['collectionDayOfWeek'] = this.collectionDayOfWeek;
    data['collectionTime'] = this.collectionTime;
    data['collectionStartDate'] = this.collectionStartDate;
    data['collectionLastScheduleDate'] = this.collectionLastScheduleDate;
    data['collectionDuration'] = this.collectionDuration;
    data['collectionExpiryDate'] = this.collectionExpiryDate;
    // if (this.photos != null) {
    //   data['photos'] = this.photos!.map((v) => v.toJson()).toList();
    // }
    data['farmType'] = this.farmType;
    data['siteType'] = this.siteType;
    data['siteOwnerName'] = this.siteOwnerName;
    data['siteOwnerNumber'] = this.siteOwnerNumber;
    data['workerNumber'] = this.workerNumber;
    data['address'] = this.address;
    data['district'] = this.district;
    data['state'] = this.state;
    data['pinCode'] = this.pinCode;
    if (this.coordinates != null) {
      data['coordinates'] = this.coordinates!.toJson();
    }
    data['comment'] = this.comment;
    data['status'] = this.status;
    data['testResult'] = this.testResult;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    // if (this.collectionCollectors != null) {
    //   data['collectionCollectors'] =
    //       this.collectionCollectors!.map((v) => v.toJson()).toList();
    // }
    if (this.diseases != null) {
      data['diseases'] = this.diseases!.map((v) => v.toJson()).toList();
    }
    return data;
  }
}

class Coordinates {
  String? type;
  List<double>? coordinates;

  Coordinates({this.type, this.coordinates});

  Coordinates.fromJson(Map<String, dynamic> json) {
    type = json['type'];
    coordinates = json['coordinates'].cast<double>();
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['type'] = this.type;
    data['coordinates'] = this.coordinates;
    return data;
  }
}

class Diseases {
  String? id;
  String? code;
  String? name;
  String? shortName;
  int? status;
  String? createdAt;
  String? updatedAt;

  Diseases(
      {this.id,
      this.code,
      this.name,
      this.shortName,
      this.status,
      this.createdAt,
      this.updatedAt});

  Diseases.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    code = json['code'];
    name = json['name'];
    shortName = json['shortName'];
    status = json['status'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['id'] = this.id;
    data['code'] = this.code;
    data['name'] = this.name;
    data['shortName'] = this.shortName;
    data['status'] = this.status;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    return data;
  }
}
