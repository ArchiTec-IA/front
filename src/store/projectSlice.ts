import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Project {
  id?: string;
  name: string;
  client?: string;
}

interface ProjectState {
  projects: Project[];
  isOpenModal: boolean;
  currentProjectId: string | null;
}

const initialState: ProjectState = {
  projects: [],
  isOpenModal: false,
  currentProjectId: null,
};

export const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    addProject: (state, action: PayloadAction<Project>) => {
      state.projects.unshift(action.payload);
    },
    setProjects: (state, action: PayloadAction<Project[]>) => {
      state.projects = action.payload;
    },
    setIsOpenModal: (state, action: PayloadAction<boolean>) => {
      state.isOpenModal = action.payload;
    },
    setCurrentProject: (state, action: PayloadAction<string | null>) => {
      state.currentProjectId = action.payload;
    },
  },
});

export const { addProject, setProjects, setIsOpenModal, setCurrentProject } =
  projectSlice.actions;
export default projectSlice.reducer;
