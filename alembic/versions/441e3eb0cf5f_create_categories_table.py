"""create categories table

Revision ID: 441e3eb0cf5f
Revises: e23b84270665
Create Date: 2025-08-27 13:30:52.706016

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '441e3eb0cf5f'
down_revision: Union[str, None] = 'e23b84270665'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        'categories',
        sa.Column('id', sa.BigInteger(), primary_key=True),
        sa.Column('name', sa.Text(), nullable=False),
        sa.Column('slug', sa.Text(), nullable=False, unique=True)

        )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table('categories')
