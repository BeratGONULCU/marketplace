"""create product_variants table

Revision ID: e23b84270665
Revises: f800786282b6
Create Date: 2025-08-26 21:46:53.933875

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e23b84270665'
down_revision: Union[str, None] = 'f800786282b6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.create_table(
        'product_variants',
        sa.Column('id', sa.BigInteger(), primary_key=True),
        sa.Column('product_id', sa.BigInteger(), sa.ForeignKey('products.id', ondelete='CASCADE'), nullable=False),
        sa.Column('color_id', sa.BigInteger(), sa.ForeignKey('colors.id'), nullable=True),
        sa.Column('size_id', sa.BigInteger(), sa.ForeignKey('sizes.id'), nullable=True),
        sa.Column('price', sa.Numeric(12, 2), nullable=False),
        sa.Column('stock', sa.Integer(), nullable=False, server_default=sa.text('0')),
        sa.Column('barcode', sa.Text(), nullable=False, unique=True),
        sa.Column('sku', sa.Text(), unique=True) # stok takip kodu
    )

    # Ürün içinde aynı (color, size) kombinasyonunu engelle
    op.create_unique_constraint(
        'uq_variant_combo',
        'product_variants',
        ['product_id', 'color_id', 'size_id']
    )

    # Sadece renk varyasyonu olan ürünlerde tekrarını engelle (bedensiz varyantlar)
    op.create_index(
        'uq_variant_color_when_no_size',
        'product_variants',
        ['product_id', 'color_id'],
        unique=True,
        postgresql_where=sa.text('size_id IS NULL')
    )


def downgrade():
    op.drop_table('product_variants')
