const { ERROR_CODES, PAGINATION_LIMIT } = require("../constants");
const Report = require("./report.model");


const getAllReports = (req, res, next) => {

    let pageNumber = parseInt(req.query.page);

    if(isNaN(pageNumber)){
        pageNumber = 1;
    }

    Report.find().skip((pageNumber - 1) * PAGINATION_LIMIT).limit(PAGINATION_LIMIT)
    .then((reports) => {
      res.status(200).json({ reports });
    })
    .catch((err) => {
      err.status = 500;
      err.code = ERROR_CODES.UNEXPECTED_ERROR;
      return next(err);
    });
}

const createReport = (req, res, next) => {

    const report = new Report({
        projectId: req.body.projectId,
        message: req.body.message,
        reporter: req.userId,
    });

    report.save()    
    .then(() => {
        res.status(200).json({ report });
    })
    .catch((err) => {
        err.status = 500;
        err.code = ERROR_CODES.UNEXPECTED_ERROR;
        return next(err);
    });
}

const deleteReport = (req, res, next) => {
    
    Report.findOneAndRemove({_id: req.params.reportId})
    .then(() => {
        res.status(200).send();
    })
    .catch((error) => {
        error.code = ERROR_CODES.PROJECT_NOT_FOUND;
        error.status = 404;
        return next(error);
    });

}

module.exports = {
    getAllReports,
    createReport,
    deleteReport,
  };