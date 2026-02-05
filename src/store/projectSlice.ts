import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Project {
  id?: string;
  name: string;
  client?: string;
}

interface ProjectState {
  projects: Project[];
}

const initialState: ProjectState = {
  projects: [],
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
  },
});

export const { addProject, setProjects } = projectSlice.actions;
export default projectSlice.reducer;
