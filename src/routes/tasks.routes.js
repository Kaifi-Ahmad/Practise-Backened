import { Router } from "express";
import {
  createTask,
  getTask,
  updateTask,
  deleteTask,
  createSubTask,
  updateSubTask,
  deleteSubTask,
} from "../controllers/task.controllers.js";
import {
  createTaskValidator,
  createSubTaskValidtor,
} from "../validators/index.validators.js";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { validateProjectPermission } from "../middleware/permission.middleware.js";
import { validation } from "../middleware/validator.middleware.js";
import { availableUserRole, userRoleEnum } from "../utils/constant.js";
const router = Router();
router.use(verifyJwt);

router
  .route("/:projectId")
  .get(validateProjectPermission(availableUserRole), getTask)
  .post(
    validateProjectPermission([userRoleEnum.ADMIN, userRoleEnum.PROJECT_ADMIN]),
    createTaskValidator(),
    validation,
    createTask
  );

router
  .route("/:projectId/t/:taskId")
  .put(
    validateProjectPermission([userRoleEnum.ADMIN, userRoleEnum.PROJECT_ADMIN]),
    updateTask
  )
  .delete(
    validateProjectPermission([userRoleEnum.ADMIN, userRoleEnum.PROJECT_ADMIN]),
    deleteTask
  );

router
  .route("/:projectId/t/:taskId/subtasks")
  .post(
    validateProjectPermission([userRoleEnum.ADMIN, userRoleEnum.PROJECT_ADMIN]),
    createSubTask
  );

router
  .route("/:projectId/t/:taskId/st/:subTaskId")
  .put(
    validateProjectPermission([userRoleEnum.ADMIN, userRoleEnum.PROJECT_ADMIN]),
    updateSubTask
  )
  .delete(
    validateProjectPermission([userRoleEnum.ADMIN, userRoleEnum.PROJECT_ADMIN]),
    deleteSubTask
  );

export default router;
