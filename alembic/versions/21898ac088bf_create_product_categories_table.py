"""create product_categories table

Revision ID: 21898ac088bf
Revises: 441e3eb0cf5f
Create Date: 2025-08-27 13:44:58.985017

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '21898ac088bf'
down_revision: Union[str, None] = '441e3eb0cf5f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    """Upgrade schema."""
    op.create_table(
        'product_categories',
        sa.Column('product_id', sa.BigInteger(), sa.ForeignKey('products.id', ondelete='CASCADE'), nullable=False),
        sa.Column('category_id', sa.BigInteger(), sa.ForeignKey('categories.id', ondelete='CASCADE'), nullable=False),
    )


def downgrade():
    """Downgrade schema."""
    op.drop_table('product_categories')
