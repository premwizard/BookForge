"""Add Template models

Revision ID: f63c0ff2f09c
Revises: 
Create Date: 2026-07-16 10:21:42.896929

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'f63c0ff2f09c'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Safely drop old templates if it exists
    op.execute("DROP TABLE IF EXISTS templates CASCADE")

    op.create_table('publishers',
    sa.Column('id', sa.UUID(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('contact_email', sa.String(), nullable=True),
    sa.Column('website', sa.String(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_publishers_name'), 'publishers', ['name'], unique=True)
    
    op.create_table('templates',
    sa.Column('id', sa.UUID(), nullable=False),
    sa.Column('publisher_id', sa.UUID(), nullable=True),
    sa.Column('user_id', sa.UUID(), nullable=True),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('category', sa.String(), nullable=True),
    sa.Column('is_active', sa.Boolean(), nullable=True),
    sa.Column('is_default', sa.Boolean(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['publisher_id'], ['publishers.id'], ondelete='SET NULL'),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='SET NULL'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_templates_id'), 'templates', ['id'], unique=False)
    op.create_index(op.f('ix_templates_name'), 'templates', ['name'], unique=False)
    
    op.create_table('template_audit_logs',
    sa.Column('id', sa.UUID(), nullable=False),
    sa.Column('template_id', sa.UUID(), nullable=False),
    sa.Column('user_id', sa.UUID(), nullable=True),
    sa.Column('action', sa.String(), nullable=False),
    sa.Column('details_json', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['template_id'], ['templates.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='SET NULL'),
    sa.PrimaryKeyConstraint('id')
    )
    
    op.create_table('template_versions',
    sa.Column('id', sa.UUID(), nullable=False),
    sa.Column('template_id', sa.UUID(), nullable=False),
    sa.Column('version_number', sa.Integer(), nullable=False),
    sa.Column('storage_path', sa.String(), nullable=False),
    sa.Column('file_type', sa.String(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['template_id'], ['templates.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    
    op.create_table('formatting_rules',
    sa.Column('id', sa.UUID(), nullable=False),
    sa.Column('template_version_id', sa.UUID(), nullable=False),
    sa.Column('rule_type', sa.String(), nullable=False),
    sa.Column('rule_data', postgresql.JSONB(astext_type=sa.Text()), nullable=False),
    sa.ForeignKeyConstraint(['template_version_id'], ['template_versions.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    
    op.create_table('template_styles',
    sa.Column('id', sa.UUID(), nullable=False),
    sa.Column('template_version_id', sa.UUID(), nullable=False),
    sa.Column('style_name', sa.String(), nullable=False),
    sa.Column('style_type', sa.String(), nullable=False),
    sa.Column('properties_json', postgresql.JSONB(astext_type=sa.Text()), nullable=False),
    sa.ForeignKeyConstraint(['template_version_id'], ['template_versions.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_template_styles_style_name'), 'template_styles', ['style_name'], unique=False)
    
    op.create_table('style_mappings',
    sa.Column('id', sa.UUID(), nullable=False),
    sa.Column('template_version_id', sa.UUID(), nullable=False),
    sa.Column('raw_element_type', sa.String(), nullable=False),
    sa.Column('template_style_id', sa.UUID(), nullable=False),
    sa.Column('is_override', sa.Boolean(), nullable=True),
    sa.ForeignKeyConstraint(['template_style_id'], ['template_styles.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['template_version_id'], ['template_versions.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    op.drop_table('style_mappings')
    op.drop_index(op.f('ix_template_styles_style_name'), table_name='template_styles')
    op.drop_table('template_styles')
    op.drop_table('formatting_rules')
    op.drop_table('template_versions')
    op.drop_table('template_audit_logs')
    op.drop_index(op.f('ix_templates_name'), table_name='templates')
    op.drop_index(op.f('ix_templates_id'), table_name='templates')
    op.drop_table('templates')
    op.drop_index(op.f('ix_publishers_name'), table_name='publishers')
    op.drop_table('publishers')
