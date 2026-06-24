import { Router } from "express";
import {
  createProject,
  updateProject,
  deleteProject,
  getProject,
  getProjectById,
  getProjectMembers,
  updateMemberRole,
  deleteMember,
  addMemberToProject,
} from "../controllers/project.controllers.js";
import {
  createProjectValidator,
  addMemberProjectValidator,
} from "../validators/index.validators.js";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { validateProjectPermission } from "../middleware/permission.middleware.js";
import { validation } from "../middleware/validator.middleware.js";
import { availableUserRole, userRoleEnum } from "../utils/constant.js";
const router = Router();
router.use(verifyJwt);

router
  .route("/")
  .get(getProject)
  .post(createProjectValidator(), validation, createProject);

router
  .route("/:projectId")
  .get(validateProjectPermission(availableUserRole), getProjectById)
  .put(
    validateProjectPermission([userRoleEnum.ADMIN]),
    createProjectValidator(),
    validation,
    updateProject
  )
  .delete(validateProjectPermission([userRoleEnum.ADMIN]), deleteProject);

router
  .route("/:projectId/members")
  .get(getProjectMembers)
  .post(
    validateProjectPermission([userRoleEnum.ADMIN, userRoleEnum.PROJECT_ADMIN]),
    addMemberProjectValidator(),
    validation,
    addMemberToProject
  );

router
  .route("/:projectId/members/:userId")
  .put(
    validateProjectPermission([userRoleEnum.ADMIN, userRoleEnum.PROJECT_ADMIN]),
    updateMemberRole
  )
  .delete(
    validateProjectPermission([userRoleEnum.ADMIN, userRoleEnum.PROJECT_ADMIN]),
    deleteMember
  );

export default router;
