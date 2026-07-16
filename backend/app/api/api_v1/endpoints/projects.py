from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from uuid import UUID

from app.api import deps
from app.models.project import Project
from app.models.user import User
from app.schemas.project import ProjectCreate, ProjectResponse, ProjectUpdate

router = APIRouter()

@router.post("/", response_model=ProjectResponse)
def create_project(
    *,
    db: Session = Depends(deps.get_db),
    project_in: ProjectCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new project.
    """
    project = Project(
        name=project_in.name,
        description=project_in.description,
        user_id=current_user.id,
        status="Active",
        favorite=project_in.favorite,
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project

@router.get("/", response_model=List[ProjectResponse])
def read_projects(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    status: Optional[str] = None,
    favorite: Optional[bool] = None,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve projects.
    """
    query = db.query(Project)
    
    if current_user.role != "Admin":
        query = query.filter(Project.user_id == current_user.id)
        
    query = query.filter(Project.archived_at == None)
    
    if search:
        query = query.filter(Project.name.ilike(f"%{search}%"))
    if status:
        query = query.filter(Project.status == status)
    if favorite is not None:
        query = query.filter(Project.favorite == favorite)
        
    projects = query.offset(skip).limit(limit).all()
    return projects
@router.get("/{id}", response_model=ProjectResponse)
def read_project(
    *,
    db: Session = Depends(deps.get_db),
    id: UUID,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get project by ID.
    """
    project = db.query(Project).filter(Project.id == id, Project.archived_at == None).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if current_user.role != "Admin" and project.user_id != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    return project

@router.patch("/{id}", response_model=ProjectResponse)
def update_project(
    *,
    db: Session = Depends(deps.get_db),
    id: UUID,
    project_in: ProjectUpdate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update a project.
    """
    project = db.query(Project).filter(Project.id == id, Project.archived_at == None).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if current_user.role != "Admin" and project.user_id != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    
    update_data = project_in.dict(exclude_unset=True)
    for field in update_data:
        setattr(project, field, update_data[field])
        
    db.add(project)
    db.commit()
    db.refresh(project)
    return project

@router.delete("/{id}", response_model=ProjectResponse)
def delete_project(
    *,
    db: Session = Depends(deps.get_db),
    id: UUID,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Soft Delete a project.
    """
    import datetime
    project = db.query(Project).filter(Project.id == id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if current_user.role != "Admin" and project.user_id != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    
    project.archived_at = datetime.datetime.utcnow()
    db.add(project)
    db.commit()
    db.refresh(project)
    return project

@router.post("/{id}/favorite", response_model=ProjectResponse)
def favorite_project(
    *,
    db: Session = Depends(deps.get_db),
    id: UUID,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Toggle favorite status.
    """
    project = db.query(Project).filter(Project.id == id, Project.archived_at == None).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if current_user.role != "Admin" and project.user_id != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    
    project.favorite = not project.favorite
    db.add(project)
    db.commit()
    db.refresh(project)
    return project

@router.post("/{id}/restore", response_model=ProjectResponse)
def restore_project(
    *,
    db: Session = Depends(deps.get_db),
    id: UUID,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Restore a soft-deleted project.
    """
    project = db.query(Project).filter(Project.id == id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if current_user.role != "Admin" and project.user_id != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    
    project.archived_at = None
    db.add(project)
    db.commit()
    db.refresh(project)
    return project
