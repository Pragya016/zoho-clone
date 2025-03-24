import { Router, Request, Response, NextFunction } from "express";
import {
  handleChangePassword,
  handleDeleteUser,
  handleFileUpload,
  handleGetChartData,
  handleGetFilteredUsers,
  handleGetUsers,
  handleUpdateUser,
} from "../controllers/admin.controller";
import { upload } from "../config/file.upload";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.get(
  "/",
  (req: Request, res: Response, next: NextFunction) => {
    authenticate(req, res, next);
  },
  (req: Request, res: Response) => {
    handleGetUsers(req, res);
  }
);

router
  .route("/:userId")
  .delete(
    //@ts-ignore
    authenticate,
    handleDeleteUser
  )
  .patch(
    //@ts-ignore
    authenticate,
    handleUpdateUser
  );

router.get(
  "/filter",
  //@ts-ignore
  authenticate,
  handleGetFilteredUsers
);

router.post(
  "/upload",
  //@ts-ignore
  authenticate,
  upload.single('employees-data'),
  handleFileUpload
);

router.get(
  "/chart-data",
  //@ts-ignore
  authenticate,
  handleGetChartData
);

router.post(
  "/change-password",
  //@ts-ignore
  authenticate,
  handleChangePassword
);

export default router;
