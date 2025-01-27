import { ErrorRequestHandler } from "express";
// ten import jest nieużywany, do usunięcia. Dlatego m.in. warto dodać lintera, żeby wyłapywał za ciebie takie rzeczy
import { MulterError } from "multer";

const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  // lepiej unikać mutacji i trochę zrefactorować ten kod, żeby nie nadpisywać tego stringa
  let errMessage = "Internal server error";

  if (err.message) {
    errMessage = `Internal server error: ${err.message}`;
  }

  // skoro już sprawdzasz czy status code istnieje, to warto go użyć w response, zamiast zawsze zwracać 500
  if (err.code) {
    errMessage += `\t Code: ${err.code}`;
  }

  // nieużywając mutacji można by było zrobić to np tak:
  const httpStatus = err.code ?? 500
  const httpMessage = err.message ?? 'Internal server error'

  const responseBody = {
    code: httpStatus,
    message: httpMessage
  }

  res.status(500).render("error", responseBody);
};

export default errorMiddleware;
