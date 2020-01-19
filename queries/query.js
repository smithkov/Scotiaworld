var Model = require("../models");
var Banner = Model.Banner;
var Institution = Model.Institution;
var Course = Model.Course;
var Departure = Model.Departure;
var Guideline = Model.Guideline;
var StudyArea = Model.StudyArea;
var Mail = Model.Mail;
var Country = Model.Country;
var User = Model.User;
var Application = Model.Application;
var City = Model.City;
var DegreeType = Model.DegreeType;
var Image = Model.Image;
var Logo = Model.Logo;
var Qualification = Model.Qualification;
var FacultyImage = Model.FacultyImage;
var FeeRange = Model.FeeRange;
var Enquiry = Model.Enquiry;
var Scholarship = Model.Scholarship;
var SurrogateFaculty = Model.surrogateFaculty;
const Op = require("sequelize").Op;

var bcrypt = require("bcryptjs");
//Courses queries

//Institution queries

//Banners query
module.exports = {
  Banner: {
    activeBanners: function() {
      return Banner.findAll({ where: { isActive: true } });
    },
    create: function(obj) {
      return Banner.create(obj);
    },
    createMany: function(array) {
      return Banner.bulkCreate(array);
    },
    findById: function(id) {
      return Banner.findByPk(id);
    },
    findAll: function() {
      return Banner.findAll();
    },
    update: function(obj, id) {
      return Banner.update(obj, { where: { id: id } });
    },
    delete: function(id) {
      return Banner.destroy({ where: { id: id } });
    }
  },
  FeeRange: {
    create: function(obj) {
      return FeeRange.create(obj);
    },

    findById: function(id) {
      return FeeRange.findByPk(id);
    },
    findAll: function() {
      return FeeRange.findAll({ include: [{ all: true }] });
    },
    findByFaculty: function(institutionId, studyId) {
      return FeeRange.findOne({
        where: { studyAreaId: studyId, institutionId: institutionId }
      });
    },
    update: function(obj, id) {
      return FeeRange.update(obj, { where: { id: id } });
    }
  },
  SurrogateFaculty: {
    create: function(obj) {
      return SurrogateFaculty.create(obj);
    },
    findById: function(id) {
      return SurrogateFaculty.findByPk(id, {
        include: [{ all: true }]
      });
    },
    findByInstitution: function(id) {
      return SurrogateFaculty.findAll({
        where: { institutionId: id },
        include: [{ all: true }]
      });
    },
    findAll: function() {
      return SurrogateFaculty.findAll({ include: [{ all: true }] });
    },
    update: function(obj, id) {
      return SurrogateFaculty.update(obj, { where: { id: id } });
    }
  },
  Departure: {
    create: function(obj) {
      return Departure.create(obj);
    },
    findById: function(id) {
      return Departure.findByPk(id);
    },
    findAll: function() {
      return Departure.findAll();
    },
    update: function(obj, id) {
      return Departure.update(obj, { where: { id: id } });
    },
    delete: function(id) {
      return Departure.destroy({ where: { id: id } });
    }
  },
  FacultyImage: {
    create: function(obj) {
      return FacultyImage.create(obj);
    },
    findById: function(id) {
      return FacultyImage.findByPk(id, { include: [{ all: true }] });
    },
    findAll: function() {
      return FacultyImage.findAll({ include: [{ all: true }] });
    },
    update: function(obj, id) {
      return FacultyImage.update(obj, { where: { id: id } });
    },
    findByStudyArea: function(id) {
      return FacultyImage.findAll({
        where: { studyAreaId: id },
        include: [{ all: true }]
      });
    },
    delete: function(id) {
      return FacultyImage.destroy({ where: { id: id } });
    }
  },
  Guideline: {
    create: function(obj) {
      return Guideline.create(obj);
    },
    findById: function(id) {
      return Guideline.findByPk(id);
    },
    findAll: function() {
      return Guideline.findAll();
    },
    update: function(obj, id) {
      return Guideline.update(obj, { where: { id: id } });
    },
    delete: function(id) {
      return Guideline.destroy({ where: { id: id } });
    }
  },
  Country: {
    create: function(obj) {
      return Country.create(obj);
    },
    findById: function(id) {
      return Country.findByPk(id);
    },
    findAll: function() {
      return Country.findAll();
    },
    update: function(obj, id) {
      return Country.update(obj, { where: { id: id } });
    },
    delete: function(id) {
      return Country.destroy({ where: { id: id } });
    },
    findByName: function(name) {
      return Country.findOne({
        where: { name: name }
      }).then(data => {
        return data.id;
      });
    }
  },
  Qualification: {
    create: function(obj) {
      return Qualification.create(obj);
    },
    findById: function(id) {
      return Qualification.findByPk(id);
    },
    findAll: function() {
      return Qualification.findAll();
    },
    update: function(obj, id) {
      return Qualification.update(obj, { where: { id: id } });
    },
    delete: function(id) {
      return Qualification.destroy({ where: { id: id } });
    }
  },
  DegreeType: {
    create: function(obj) {
      return DegreeType.create(obj);
    },
    findById: function(id) {
      return DegreeType.findByPk(id);
    },
    update: function(obj, id) {
      return DegreeType.update(obj, { where: { id: id } });
    },
    findAll: function() {
      return DegreeType.findAll();
    },
    delete: function(id) {
      return DegreeType.destroy({ where: { id: id } });
    }
  },
  City: {
    findAll: function() {
      return City.findAll();
    },
    create: function(obj) {
      return City.create(obj);
    },
    findById: function(id) {
      return City.findByPk(id);
    },
    update: function(obj, id) {
      return City.update(obj, { where: { id: id } });
    },
    delete: function(id) {
      return City.destroy({ where: { id: id } });
    }
  },
  Scholarship: {
    findAll: function() {
      return Scholarship.findAll();
    },
    create: function(obj) {
      return Scholarship.create(obj);
    },
    findById: function(id) {
      return Scholarship.findByPk(id);
    },
    update: function(obj, id) {
      return Scholarship.update(obj, { where: { id: id } });
    },
    delete: function(id) {
      return Scholarship.destroy({ where: { id: id } });
    }
  },
  Logo: {
    findAll: function() {
      return Logo.findAll();
    },
    create: function(obj) {
      return Logo.create(obj);
    },
    findById: function(id) {
      return Logo.findByPk(id);
    },
    update: function(obj, id) {
      return Logo.update(obj, { where: { id: id } });
    },
    delete: function(id) {
      return Logo.destroy({ where: { id: id } });
    }
  },
  Institution: {
    findAll: function() {
      return Institution.findAll({
        include: ["Courses", "City"]
      });
    },
    paginatedFindAll: function() {
      return Institution.findAll({
        include: ["StudyAreas"]
      });
    },
    findById: function(id) {
      return Institution.findByPk(id, { include: [{ model: City }] });
    },
    create: function(obj) {
      return Institution.create(obj);
    },
    update: function(obj, id) {
      return Institution.update(obj, { where: { id: id } });
    },
    delete: function(id) {
      return Institution.destroy({ where: { id: id } });
    }
  },
  Course: {
    findAll: function() {
      return Course.findAll({
        include: [{ all: true }]
      });
    },
    findPaginated: function(offs, lim, name) {
      return name
        ? Course.findAll({
            where: { name: { [Op.like]: `%${name}%` } },
            offset: offs,
            limit: lim,
            include: [{ all: true }]
          })
        : Course.findAll({
            offset: offs,
            limit: lim,
            include: [{ all: true }]
          });
    },
    findByPopular: async function() {
      let course = await Course.findAll({
        where: { isPopular: true }
      });
      let courseLength = course.length;
      let randNum = Math.floor(Math.random() * courseLength) + 1;
      if (randNum >= courseLength) {
        randNum = courseLength - 7;
      }

      return Course.findAll({
        where: { isPopular: true },
        limit: 20,
        offset: randNum,
        include: { all: true }
      });
    },

    findNameByInstitutionId: function(id, name) {
      return Course.findOne({
        where: { institutionId: id, name: name },
        include: [{ all: true }]
      });
    },
    findByInstitutionId: function(id) {
      return Course.findAll({
        where: { institutionId: id },
        include: [{ all: true }]
      });
    },
    findByFacultyId: function(id, institutionId) {
      return Course.findAll({
        where: { studyAreaId: id, institutionId: institutionId },
        include: [{ all: true }]
      });
    },
    findByInstitutionIdSearch: function(
      schoolId,
      facultyId,
      degreeTypeId,
      offSet
    ) {
      let dataObj = {
        institutionId: schoolId,
        studyAreaId: facultyId,
        degreeTypeId: degreeTypeId
      };
      let hasValues = true;

      if (facultyId == 0) {
        delete dataObj.studyAreaId;
      }
      if (schoolId == 0) {
        delete dataObj.institutionId;
      }
      if (degreeTypeId == 0) {
        delete dataObj.degreeTypeId;
      }

      if (schoolId == 0 && facultyId == 0 && degreeTypeId == 0)
        hasValues = false;

      return hasValues
        ? Course.findAll({
            where: dataObj,
            offset: 0,
            limit: 10,
            include: [{ all: true }]
          })
        : Course.findAll({
            offset: offSet,
            limit: 10,
            include: [{ all: true }]
          });
    },

    findCourseByFacultyAndSchool: function(facultyId, schoolId) {
      return Course.findAll({
        where: { institutionId: schoolId, studyAreaId: facultyId },
        include: ["StudyArea", "DegreeType", "Institution"]
      });
    },
    findPopular: function(degreeTypeId, facultyId, institutionId) {
      let paramObj = {
        degreeTypeId: degreeTypeId,
        studyAreaId: facultyId,
        institutionId: institutionId,
        isPopular: true
      };

      let isReturnAll = false;
      if (degreeTypeId == 0) delete paramObj.degreeTypeId;
      if (facultyId == 0) delete paramObj.studyAreaId;
      if (institutionId == 0) delete paramObj.institutionId;

      if (degreeTypeId == 0 && facultyId == 0 && institutionId == 0)
        isReturnAll = true;

      return isReturnAll
        ? Course.findAll({
            where: { isPopular: true },
            include: [{ all: true }]
          })
        : Course.findAll({
            where: paramObj,
            include: [{ all: true }]
          });
    },
    courseSearch: function(degreeTypeId, facultyId, institutionId) {
      let paramObj = {
        degreeTypeId: degreeTypeId,
        studyAreaId: facultyId,
        institutionId: institutionId
      };
      let isReturnAll = false;
      if (degreeTypeId == 0) delete paramObj.degreeTypeId;
      if (facultyId == 0) delete paramObj.studyAreaId;
      if (institutionId == 0) delete paramObj.institutionId;
      if (degreeTypeId == 0 && facultyId == 0 && institutionId == 0)
        isReturnAll = true;

      return isReturnAll
        ? Course.findAll({
            include: [{ all: true }]
          })
        : Course.findAll({
            where: paramObj,
            include: [{ all: true }]
          });
    },
    create: function(obj) {
      return Course.create(obj);
    },
    findById: function(id) {
      return Course.findByPk(id, {
        include: [{ all: true }]
      });
    },
    update: function(obj, id) {
      return Course.update(obj, { where: { id: id } });
    },
    delete: function(id) {
      return Course.destroy({ where: { id: id } });
    }
  },
  StudyArea: {
    findAll: function() {
      return StudyArea.findAll({
        include: [{ all: true }]
      });
    },
    findByInstitutionId: function(id) {
      return StudyArea.findAll({
        where: { institutionId: id },
        include: [{ all: true }]
      });
    },
    create: function(obj) {
      return StudyArea.create(obj);
    },
    findById: function(id) {
      return StudyArea.findByPk(id, {
        include: [{ all: true }]
      });
    },
    update: function(obj, id) {
      return StudyArea.update(obj, { where: { id: id } });
    },
    delete: function(id) {
      return StudyArea.destroy({ where: { id: id } });
    }
  },
  Mail: {
    findAll: function() {
      return Mail.findAll({
        include: [{ all: true }]
      });
    },

    create: function(obj) {
      return Mail.create(obj);
    },
    createMany: function(array) {
      return Mail.bulkCreate(array);
    },
    findById: function(id) {
      return Mail.findByPk(id, {
        include: [{ all: true }]
      });
    },
    findByUserId: function(user) {
      if (user.roleId) {
        return Mail.findAll({
          where: { isPublic: false, [Op.not]: { senderId: user.id } },
          include: [{ all: true }],
          order: [["createdAt", "DESC"]]
        });
      } else {
        return Mail.findAll({
          where: {
            [Op.or]: [{ userId: user.id }, { isPublic: true }]
          },
          include: [{ all: true }],
          order: [["createdAt", "DESC"]]
        });
      }
    },
    findSentMessages: function(id) {
      return Mail.findAll({
        where: { senderId: id },
        include: [{ all: true }]
      });
    },
    findAdminUnreadMessages: function(userId) {
      return Mail.findAll({
        where: {
          hasReadAdmin: false,
          isPublic: false,
          [Op.not]: { senderId: userId }
        },
        include: [{ all: true }]
      });
    },
    update: function(obj, id) {
      return Mail.update(obj, { where: { id: id } });
    },
    delete: function(id) {
      return Mail.destroy({ where: { id: id } });
    }
  },
  Enquiry: {
    findAll: function() {
      return Enquiry.findAll();
    },

    create: function(obj) {
      return Enquiry.create(obj);
    },
    findById: function(id) {
      return Enquiry.findByPk(id);
    },

    delete: function(id) {
      return Enquiry.destroy({ where: { id: id } });
    }
  },
  User: {
    findAll: function() {
      return User.findAll();
    },
    findPaginated: function(username) {
      return User.findAll({
        where: { username: { [Op.like]: `%${username}%` } },
        limit: 10
      });
    },
    create: function(obj) {
      return User.create(obj);
    },
    findById: function(id) {
      return User.findByPk(id);
    },
    findByUsername: function(username) {
      return User.findOne({
        where: { username: username },
        include: [{ all: true }]
      });
    },
    update: function(obj, id) {
      return User.update(obj, { where: { id: id } });
    },
    delete: function(id) {
      return User.destroy({ where: { id: id } });
    }
  },
  Application: {
    findAll: function() {
      return Application.findAll({ include: [{ all: true }] });
    },
    create: function(obj) {
      return Application.create(obj);
    },
    findById: function(id) {
      return Application.findByPk(id);
    },
    update: function(obj, id) {
      return Application.update(obj, { where: { id: id } });
    },
    delete: function(id) {
      return Application.destroy({ where: { id: id } });
    },
    findByUser: function(id) {
      return Application.findOne({
        where: { userId: id, hasDeleted: false },
        include: [{ all: true }]
      });
    },
    findBySubmitted: function(id) {
      return Application.findAll({
        where: { hasSubmitted: true },
        include: [{ all: true }]
      });
    }
  }
};
module.exports.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    console.log(` the error is: ${err}`);
    //	if(err) throw err;
    callback(null, isMatch);
  });
};
