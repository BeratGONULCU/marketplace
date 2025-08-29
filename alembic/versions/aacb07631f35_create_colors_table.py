"""create colors table

Revision ID: aacb07631f35
Revises: de5735e530d3
Create Date: 2025-08-26 19:57:23.561087

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'aacb07631f35'
down_revision: Union[str, None] = 'de5735e530d3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        'colors',
        sa.Column('id', sa.BigInteger(), primary_key=True),
        sa.Column('name', sa.Text(), nullable=False),
        sa.Column('hex', sa.Text(), nullable=False),
    )
    # name kolonunu küçük/büyük harf fark etmeksizin unique yapmak için index:
    op.create_index(
        'uq_colors_name_lower',
        'colors',
        [sa.text('LOWER(name)')],
        unique=True
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index('uq_colors_name_lower', table_name='colors')
    op.drop_table('colors')
