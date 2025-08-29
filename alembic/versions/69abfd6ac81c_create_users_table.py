"""create users table

Revision ID: 69abfd6ac81c
Revises: 6fce463e240b
Create Date: 2025-08-27 15:31:38.283951

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '69abfd6ac81c'
down_revision: Union[str, None] = '6fce463e240b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
        op.create_table(
        'users',
        sa.Column('id', sa.BigInteger(), primary_key=True),
        sa.Column('email', sa.Text(), nullable=False, unique=True),
        sa.Column('hashed_password', sa.Text(), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False,default=True),
        sa.Column('is_admin', sa.Boolean(), nullable=False,default=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        )


def downgrade():
    op.drop_table('users')
