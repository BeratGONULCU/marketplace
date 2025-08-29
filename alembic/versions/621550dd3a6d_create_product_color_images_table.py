"""create product_color_images table

Revision ID: 621550dd3a6d
Revises: aacb07631f35
Create Date: 2025-08-26 21:09:49.202022

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '621550dd3a6d'
down_revision: Union[str, None] = 'aacb07631f35'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        'product_color_images',
        sa.Column('id', sa.BigInteger(), primary_key=True),
        sa.Column('product_id', sa.BigInteger(), sa.ForeignKey('products.id', ondelete='CASCADE'), nullable=False),
        sa.Column('color_id', sa.BigInteger(), sa.ForeignKey('colors.id'), nullable=False),
        sa.Column('url', sa.Text(), nullable=False),
        sa.Column('sort', sa.Integer(), nullable=False, server_default=sa.text('0'))
    )
    op.create_index(
        'idx_product_color',          
        'product_color_images',       
        ['product_id', 'color_id']    
    )


def downgrade():
    op.drop_table('product_color_images')
