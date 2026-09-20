import { api } from "@/lib/api";
import type {
  CreateIssueInput,
  UpdateIssueInput,
  ReorderInput,
  AssigneeInput,
  CreateCommentInput,
} from "shared";

export interface Issue {
  id: string;
  title: string;
  description: string | null;
  boardId: string;
  sectionId: string;
  position: number;
  createdAt: string;
  updatedAt: string;
  assignees: string[];
}

export interface IssueDetail extends Issue {
  comments: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: { id: string; name: string };
}

export const IssueApi = {
  createIssue: async (sectionId: string, data: CreateIssueInput) => {
    const response = await api.post(`/issue/section/${sectionId}/issues`, data);
    return response.data.data as Issue;
  },

  getIssuesByBoard: async (boardId: string) => {
    const response = await api.get(`/issue/board/${boardId}/issues`);
    return response.data.data as Issue[];
  },

  getIssueById: async (issueId: string) => {
    const response = await api.get(`/issue/${issueId}`);
    return response.data.data as IssueDetail;
  },

  updateIssue: async (issueId: string, data: UpdateIssueInput) => {
    const response = await api.patch(`/issue/${issueId}`, data);
    return response.data.data as Issue;
  },

  deleteIssue: async (issueId: string) => {
    const response = await api.delete(`/issue/${issueId}`);
    return response.data;
  },

  addAssignee: async (issueId: string, data: AssigneeInput) => {
    const response = await api.post(`/issue/${issueId}/assignees`, data);
    return response.data;
  },

  removeAssignee: async (issueId: string, userId: string) => {
    const response = await api.delete(`/issue/${issueId}/assignees/${userId}`);
    return response.data;
  },

  reorderIssues: async (sectionId: string, data: ReorderInput) => {
    const response = await api.patch(
      `/issue/section/${sectionId}/issues/reorder`,
      data,
    );
    return response.data;
  },

  reorderSections: async (boardId: string, data: ReorderInput) => {
    const response = await api.patch(
      `/issue/board/${boardId}/sections/reorder`,
      data,
    );
    return response.data;
  },

  // Comments
  getComments: async (issueId: string) => {
    const response = await api.get(`/comment/issue/${issueId}/comments`);
    return response.data.data as Comment[];
  },

  createComment: async (issueId: string, data: CreateCommentInput) => {
    const response = await api.post(`/comment/issue/${issueId}/comments`, data);
    return response.data.data as Comment;
  },

  deleteComment: async (commentId: string) => {
    const response = await api.delete(`/comment/${commentId}`);
    return response.data;
  },
};
