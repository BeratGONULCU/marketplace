"""create sizes table

Revision ID: f800786282b6
Revises: d2156da7a52c
Create Date: 2025-08-26 21:33:38.236698

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f800786282b6'
down_revision: Union[str, None] = 'd2156da7a52c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table('sizes',
    sa.Column('id',sa.BigInteger(),primary_key=True),
    sa.Column('code',sa.Text(),nullable=False)
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table('sizes')
