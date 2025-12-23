
import React from 'react';
import { Project, ProjectStatus } from '../types';

interface ProjectCardProps {
  project: Project;
  onSelect: (p: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect }) => {
  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.PUBLISHED: return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case ProjectStatus.REVIEW: return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case ProjectStatus.DRAFT: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div 
      onClick={() => onSelect(project)}
      className="group bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden cursor-pointer transition-all hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10"
    >
      <div className="relative h-40 overflow-hidden">
        <img 
          src={project.thumbnail} 
          alt={project.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 text-xs font-semibold border rounded-full ${getStatusColor(project.status)}`}>
            {project.status}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">
          {project.name}
        </h3>
        <p className="text-slate-400 text-sm line-clamp-2 mb-4 h-10">
          {project.description}
        </p>
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-user-circle text-indigo-400"></i>
            <span>{project.author}</span>
          </div>
          <span>{project.lastModified}</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
