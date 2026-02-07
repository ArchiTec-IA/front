import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Project {
  id?: string;
  name: string;
  client?: string;
}

interface ProjectState {
  projects: Project[];
  isOpenModal: boolean;
}

const initialState: ProjectState = {
  projects: [],
  isOpenModal: false,
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
  },
});

export const { addProject, setProjects, setIsOpenModal } = projectSlice.actions;
export default projectSlice.reducer;
