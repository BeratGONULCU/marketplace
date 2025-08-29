"""create product_images table

Revision ID: d2156da7a52c
Revises: 621550dd3a6d
Create Date: 2025-08-26 21:27:20.863970

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd2156da7a52c'
down_revision: Union[str, None] = '621550dd3a6d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    """Upgrade schema."""
    op.create_table('product_images',
    sa.Column('id', sa.BigInteger(), nullable=False),
    sa.Column('product_id', sa.BigInteger(), sa.ForeignKey('products.id', ondelete='CASCADE'), nullable=False),
    sa.Column('url', sa.Text(), nullable=False),
    sa.Column('sort', sa.Integer(), nullable=False, server_default=sa.text('0')),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table('product_images')
