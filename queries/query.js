var Model = require("../models");
var Banner = Model.Banner;
var Institution = Model.Institution;
var Course = Model.Course;
var Departure = Model.Departure;
var Guideline = Model.Guideline;
var StudyArea = Model.StudyArea;
var Country = Model.Country;
var User = Model.User;
var Application = Model.Application;
var City = Model.City;
var DegreeType = Model.DegreeType;
var Image = Model.Image;
var Logo = Model.Logo;
var Qualification = Model.Qualification;
var FacultyImage = Model.FacultyImage;
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
        include: ["Institution", "DegreeType", "StudyArea"]
      });
    },
    findByPopular: function() {
      return Course.findAll({
        where: { isPopular: true },
        limit: 4,
        include: { all: true }
      });
    },
    findByInstitutionId: function(id) {
      return Course.findAll({
        where: { institutionId: id },
        include: [{ all: true }]
      });
    },
    findCourseByFacultyAndSchool: function(facultyId, schoolId) {
      return Course.findAll({
        where: { institutionId: schoolId, studyAreaId: facultyId },
        include: ["StudyArea", "DegreeType", "Institution"]
      });
    },
    create: function(obj) {
      return Course.create(obj);
    },
    findById: function(id) {
      return Course.findByPk(id, {
        include: ["Institution", "DegreeType", "StudyArea"]
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
      return StudyArea.findAll();
    },
    findByInstitutionId: function(id) {
      return StudyArea.findAll({ where: { institutionId: id } });
    },
    create: function(obj) {
      return StudyArea.create(obj);
    },
    findById: function(id) {
      return StudyArea.findByPk(id);
    },
    update: function(obj, id) {
      return StudyArea.update(obj, { where: { id: id } });
    },
    delete: function(id) {
      return StudyArea.destroy({ where: { id: id } });
    }
  },
  User: {
    findAll: function() {
      return User.findAll();
    },
    create: function(obj) {
      return User.create(obj);
    },
    findById: function(id) {
      return User.findByPk(id);
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
        where: { userId: id },
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
