from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db import SessionLocal, get_db
from app.dependencies import get_current_user
from app.models.size import Size
from app.models.user import User
from app.schemas.size import SizeCreate,SizeOut,SizeUpdate

router = APIRouter(prefix="/sizes" ,tags=["sizes"])

#create admin kontrolü olacak 
@router.post("/",response_model=SizeOut)
def size_create(payload: SizeCreate, db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="kullanıcı yetkisi yok"
        )

    new_size = Size(**payload.model_dump())
    db.add(new_size)
    db.commit()
    db.refresh(new_size)
    return new_size


@router.get("/",response_model=list[SizeOut])
def get_all_sizes(db: Session = Depends(get_db)):
    return db.query(Size).all()


@router.get("/{size_id}",response_model=SizeOut)
def get_size_by_id(size_id: int, db: Session = Depends(get_db)):
    size = db.query(Size).filter(Size.id == size_id).first()
    if not size:
        raise HTTPException(status_code=404, detail="size not found with that id")
    return size

@router.delete("/{size_id}", response_model=SizeOut)
def delete_size_by_id(size_id: int,db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="kullanıcı yetkisi yok"
        )
    size = db.query(Size).filter(Size.id == size_id).first()
    if not size:
        raise HTTPException(status_code=404,detail="not found to delete with that id")
    db.delete(size)
    db.commit()
    return size

#UPDATE
@router.put("/{size_id}", response_model=SizeOut)
def update_size_by_id(size_id: int, payload: SizeUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="kullanıcı yetkisi yok"
        )    
    
    size = db.query(Size).filter(Size.id == size_id).first()
    if not size:
        raise HTTPException(status_code=404, detail="Size not found with that id")
    
    size.code = payload.code  # gelen veriye göre güncelleme
    db.commit()
    db.refresh(size)  # güncel halini almak için
    return size


