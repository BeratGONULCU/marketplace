"""create products table

Revision ID: de5735e530d3
Revises: 
Create Date: 2025-08-26 19:54:23.977146

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = 'de5735e530d3'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    """Upgrade schema."""
    op.create_table('products',
    sa.Column('id', sa.BigInteger(), nullable=False),
    sa.Column('user_id', sa.BigInteger(), sa.ForeignKey('users.id',ondelete='CASCADE'),nullable=False),
    sa.Column('type', sa.Enum('STANDARD', 'VARIANTED', name='product_type'), nullable=False),
    sa.Column('title', sa.Text(), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('base_price', sa.Numeric(precision=12, scale=2), nullable=True),
    sa.Column('base_stock', sa.Integer(), nullable=True),
    sa.Column('is_published', sa.Boolean(), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )


def downgrade():
    op.drop_table('products')
