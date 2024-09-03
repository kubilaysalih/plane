// types
import type { IProjectMember, IUser } from "@plane/types";
// services
import { API_BASE_URL, APIService } from "./api.service.js";

export class UserService extends APIService {
  constructor() {
    super(API_BASE_URL);
  }

  currentUserConfig() {
    return {
      url: `${this.baseURL}/api/users/me/`,
    };
  }

  async currentUser(cookie: string): Promise<IUser> {
    return this.get("/api/users/me/", {
      headers: {
        Cookie: cookie,
      },
    })
      .then((response) => response?.data)
      .catch((error) => {
        throw error;
      });
  }

  async getUserWorkspaceMembership(
    workspaceSlug: string,
    cookie: string
  ): Promise<IProjectMember> {
    return this.get(`/api/workspaces/${workspaceSlug}/workspace-members/me/`,
      {
        headers: {
          Cookie: cookie,
        },
      })
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response;
      });
  }

  async getUserProjectMembership(
    workspaceSlug: string,
    projectId: string,
    cookie: string
  ): Promise<IProjectMember> {
    return this.get(`/api/workspaces/${workspaceSlug}/projects/${projectId}/project-members/me/`,
      {
        headers: {
          Cookie: cookie,
        },
      })
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response;
      });
  }
}
