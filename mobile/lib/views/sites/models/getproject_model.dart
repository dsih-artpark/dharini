class GetProjectsModel {
  bool? success;
  String? message;
  Data? data;

  GetProjectsModel({this.success, this.message, this.data});

  GetProjectsModel.fromJson(Map<String, dynamic> json) {
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
  String? name;
  String? code;
  String? email;
  List<String>? logisticDetails;
  String? processDetail;
  bool? isOnboardingCompleted;
  int? status;
  String? createdAt;
  String? updatedAt;
  List<Members>? members;
  List<Diseases>? diseases;
  List<Locations>? locations;
  List<Sites>? sites;
  List<SurveillanceTypes>? surveillanceTypes;
  List<ProjectAdmins>? projectAdmins;

  Docs(
      {this.id,
      this.name,
      this.code,
      this.email,
      this.logisticDetails,
      this.processDetail,
      this.isOnboardingCompleted,
      this.status,
      this.createdAt,
      this.updatedAt,
      this.members,
      this.diseases,
      this.locations,
      this.sites,
      this.surveillanceTypes,
      this.projectAdmins});

  Docs.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    name = json['name'];
    code = json['code'];
    email = json['email'];
    logisticDetails = json['logisticDetails'].cast<String>();
    processDetail = json['processDetail'];
    isOnboardingCompleted = json['isOnboardingCompleted'];
    status = json['status'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    if (json['members'] != null) {
      members = <Members>[];
      json['members'].forEach((v) {
        members!.add(new Members.fromJson(v));
      });
    }
    if (json['diseases'] != null) {
      diseases = <Diseases>[];
      json['diseases'].forEach((v) {
        diseases!.add(new Diseases.fromJson(v));
      });
    }
    if (json['locations'] != null) {
      locations = <Locations>[];
      json['locations'].forEach((v) {
        locations!.add(new Locations.fromJson(v));
      });
    }
    if (json['sites'] != null) {
      sites = <Sites>[];
      json['sites'].forEach((v) {
        sites!.add(new Sites.fromJson(v));
      });
    }
    if (json['surveillanceTypes'] != null) {
      surveillanceTypes = <SurveillanceTypes>[];
      json['surveillanceTypes'].forEach((v) {
        surveillanceTypes!.add(new SurveillanceTypes.fromJson(v));
      });
    }
    if (json['projectAdmins'] != null) {
      projectAdmins = <ProjectAdmins>[];
      json['projectAdmins'].forEach((v) {
        projectAdmins!.add(new ProjectAdmins.fromJson(v));
      });
    }
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['id'] = this.id;
    data['name'] = this.name;
    data['code'] = this.code;
    data['email'] = this.email;
    data['logisticDetails'] = this.logisticDetails;
    data['processDetail'] = this.processDetail;
    data['isOnboardingCompleted'] = this.isOnboardingCompleted;
    data['status'] = this.status;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    if (this.members != null) {
      data['members'] = this.members!.map((v) => v.toJson()).toList();
    }
    if (this.diseases != null) {
      data['diseases'] = this.diseases!.map((v) => v.toJson()).toList();
    }
    if (this.locations != null) {
      data['locations'] = this.locations!.map((v) => v.toJson()).toList();
    }
    if (this.sites != null) {
      data['sites'] = this.sites!.map((v) => v.toJson()).toList();
    }
    if (this.surveillanceTypes != null) {
      data['surveillanceTypes'] =
          this.surveillanceTypes!.map((v) => v.toJson()).toList();
    }
    if (this.projectAdmins != null) {
      data['projectAdmins'] =
          this.projectAdmins!.map((v) => v.toJson()).toList();
    }
    return data;
  }
}

class Members {
  String? id;
  Null firstName;
  Null lastName;
  Null designation;
  Null contactNumber;
  Null address;
  String? email;
  Null otp;
  String? userType;
  int? status;
  String? createdAt;
  String? updatedAt;
  List<Roles>? roles;

  Members(
      {this.id,
      this.firstName,
      this.lastName,
      this.designation,
      this.contactNumber,
      this.address,
      this.email,
      this.otp,
      this.userType,
      this.status,
      this.createdAt,
      this.updatedAt,
      this.roles});

  Members.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    firstName = json['firstName'];
    lastName = json['lastName'];
    designation = json['designation'];
    contactNumber = json['contactNumber'];
    address = json['address'];
    email = json['email'];
    otp = json['otp'];
    userType = json['userType'];
    status = json['status'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    if (json['roles'] != null) {
      roles = <Roles>[];
      json['roles'].forEach((v) {
        roles!.add(new Roles.fromJson(v));
      });
    }
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['id'] = this.id;
    data['firstName'] = this.firstName;
    data['lastName'] = this.lastName;
    data['designation'] = this.designation;
    data['contactNumber'] = this.contactNumber;
    data['address'] = this.address;
    data['email'] = this.email;
    data['otp'] = this.otp;
    data['userType'] = this.userType;
    data['status'] = this.status;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    if (this.roles != null) {
      data['roles'] = this.roles!.map((v) => v.toJson()).toList();
    }
    return data;
  }
}

class Roles {
  String? id;
  String? name;
  int? status;
  String? createdAt;
  String? updatedAt;
  List<Permissions>? permissions;

  Roles(
      {this.id,
      this.name,
      this.status,
      this.createdAt,
      this.updatedAt,
      this.permissions});

  Roles.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    name = json['name'];
    status = json['status'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    if (json['permissions'] != null) {
      permissions = <Permissions>[];
      json['permissions'].forEach((v) {
        permissions!.add(new Permissions.fromJson(v));
      });
    }
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['id'] = this.id;
    data['name'] = this.name;
    data['status'] = this.status;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    if (this.permissions != null) {
      data['permissions'] = this.permissions!.map((v) => v.toJson()).toList();
    }
    return data;
  }
}

class Permissions {
  String? id;
  String? action;
  String? subject;
  int? status;
  String? createdAt;
  String? updatedAt;

  Permissions(
      {this.id,
      this.action,
      this.subject,
      this.status,
      this.createdAt,
      this.updatedAt});

  Permissions.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    action = json['action'];
    subject = json['subject'];
    status = json['status'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['id'] = this.id;
    data['action'] = this.action;
    data['subject'] = this.subject;
    data['status'] = this.status;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
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

class Locations {
  String? id;
  String? stateName;
  String? stateCode;
  String? lgdCode;
  String? districtName;
  String? localName;
  MetaData? metaData;
  int? status;
  String? createdAt;
  String? updatedAt;

  Locations(
      {this.id,
      this.stateName,
      this.stateCode,
      this.lgdCode,
      this.districtName,
      this.localName,
      this.metaData,
      this.status,
      this.createdAt,
      this.updatedAt});

  Locations.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    stateName = json['stateName'];
    stateCode = json['stateCode'];
    lgdCode = json['lgdCode'];
    districtName = json['districtName'];
    localName = json['localName'];
    metaData = json['metaData'] != null
        ? new MetaData.fromJson(json['metaData'])
        : null;
    status = json['status'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['id'] = this.id;
    data['stateName'] = this.stateName;
    data['stateCode'] = this.stateCode;
    data['lgdCode'] = this.lgdCode;
    data['districtName'] = this.districtName;
    data['localName'] = this.localName;
    if (this.metaData != null) {
      data['metaData'] = this.metaData!.toJson();
    }
    data['status'] = this.status;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    return data;
  }
}

class MetaData {
  int? lgdCode;
  String? localName;
  int? stateCode;
  String? stateName;
  String? districtName;
  String? census2001Code;
  int? census2011Code;
  String? shortDistrictName;

  MetaData(
      {this.lgdCode,
      this.localName,
      this.stateCode,
      this.stateName,
      this.districtName,
      this.census2001Code,
      this.census2011Code,
      this.shortDistrictName});

  MetaData.fromJson(Map<String, dynamic> json) {
    lgdCode = json['lgdCode'];
    localName = json['localName'];
    stateCode = json['stateCode'];
    stateName = json['stateName'];
    districtName = json['districtName'];
    census2001Code = json['census2001Code'];
    census2011Code = json['census2011Code'];
    shortDistrictName = json['shortDistrictName'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['lgdCode'] = this.lgdCode;
    data['localName'] = this.localName;
    data['stateCode'] = this.stateCode;
    data['stateName'] = this.stateName;
    data['districtName'] = this.districtName;
    data['census2001Code'] = this.census2001Code;
    data['census2011Code'] = this.census2011Code;
    data['shortDistrictName'] = this.shortDistrictName;
    return data;
  }
}

class Sites {
  String? id;
  String? name;
  String? siteCode;
  Null collectionConsent;
  Null collectionFrequencyInterval;
  Null collectionFrequency;
  Null collectionDayOfWeek;
  Null collectionTime;
  Null collectionStartDate;
  Null collectionLastScheduleDate;
  Null collectionDuration;
  Null collectionExpiryDate;
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
  Null comment;
  int? status;
  String? testResult;
  String? createdAt;
  String? updatedAt;

  Sites(
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
      this.updatedAt});

  Sites.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    name = json['name'];
    siteCode = json['siteCode'];
    collectionConsent = json['collectionConsent'];
    collectionFrequencyInterval = json['collectionFrequencyInterval'];
    collectionFrequency = json['collectionFrequency'];
    collectionDayOfWeek = json['collectionDayOfWeek'];
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

class SurveillanceTypes {
  String? id;
  String? name;
  int? status;
  String? createdAt;
  String? updatedAt;

  SurveillanceTypes(
      {this.id, this.name, this.status, this.createdAt, this.updatedAt});

  SurveillanceTypes.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    name = json['name'];
    status = json['status'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['id'] = this.id;
    data['name'] = this.name;
    data['status'] = this.status;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    return data;
  }
}

class ProjectAdmins {
  String? id;
  String? firstName;
  String? lastName;
  String? designation;
  String? contactNumber;
  Null address;
  String? email;
  Null otp;
  String? userType;
  int? status;
  String? createdAt;
  String? updatedAt;

  ProjectAdmins(
      {this.id,
      this.firstName,
      this.lastName,
      this.designation,
      this.contactNumber,
      this.address,
      this.email,
      this.otp,
      this.userType,
      this.status,
      this.createdAt,
      this.updatedAt});

  ProjectAdmins.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    firstName = json['firstName'];
    lastName = json['lastName'];
    designation = json['designation'];
    contactNumber = json['contactNumber'];
    address = json['address'];
    email = json['email'];
    otp = json['otp'];
    userType = json['userType'];
    status = json['status'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['id'] = this.id;
    data['firstName'] = this.firstName;
    data['lastName'] = this.lastName;
    data['designation'] = this.designation;
    data['contactNumber'] = this.contactNumber;
    data['address'] = this.address;
    data['email'] = this.email;
    data['otp'] = this.otp;
    data['userType'] = this.userType;
    data['status'] = this.status;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    return data;
  }
}
