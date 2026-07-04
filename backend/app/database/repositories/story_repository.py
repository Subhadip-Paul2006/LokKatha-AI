"""Story repository for database operations."""

from __future__ import annotations

import logging
from typing import Any
from uuid import UUID

from supabase import Client

from app.core.exceptions import DatabaseError, DuplicateRecordError, RecordNotFoundError
from app.schemas.story import StoryBrief, StoryCreate, StoryInDB, StoryUpdate

logger = logging.getLogger(__name__)


class StoryRepository:
    """Handles database operations for the Story entity using Supabase."""

    def __init__(self, client: Client, table_name: str = "stories") -> None:
        """Initialize the repository with a Supabase client and target table."""
        self.client = client
        self.table = table_name

    async def create_story(self, story_in: StoryCreate) -> StoryInDB:
        """Create a new story record.

        Raises:
            DuplicateRecordError: If a story with the same unique constraints exists.
            DatabaseError: On unexpected database failures.
        """
        try:
            data = story_in.model_dump(exclude_unset=True)
            response = self.client.table(self.table).insert(data).execute()
            
            if not response.data:
                raise DatabaseError("Insert operation returned no data.")
                
            logger.info("Created new story record.")
            return StoryInDB.model_validate(response.data[0])
        except Exception as e:
            logger.error("Failed to create story: %s", e)
            # Basic error translation (PostgREST errors often contain "duplicate key")
            if "duplicate key" in str(e).lower():
                raise DuplicateRecordError() from e
            raise DatabaseError(f"Failed to create story: {e}") from e

    async def get_story(self, story_id: UUID) -> StoryInDB:
        """Retrieve a story by its ID.

        Raises:
            RecordNotFoundError: If the story does not exist.
            DatabaseError: On unexpected database failures.
        """
        try:
            response = self.client.table(self.table).select("*").eq("id", str(story_id)).execute()
            
            if not response.data:
                raise RecordNotFoundError(entity="Story", entity_id=str(story_id))
                
            return StoryInDB.model_validate(response.data[0])
        except RecordNotFoundError:
            raise
        except Exception as e:
            logger.error("Failed to get story %s: %s", story_id, e)
            raise DatabaseError(f"Failed to retrieve story: {e}") from e

    async def get_all_stories(self, limit: int = 50, offset: int = 0) -> list[StoryBrief]:
        """Retrieve a paginated list of stories (brief projection)."""
        try:
            response = (
                self.client.table(self.table)
                .select("id, title, speaker_name, village, district, language, image_url, created_at")
                .order("created_at", desc=True)
                .range(offset, offset + limit - 1)
                .execute()
            )
            
            return [StoryBrief.model_validate(item) for item in response.data]
        except Exception as e:
            logger.error("Failed to get all stories: %s", e)
            raise DatabaseError(f"Failed to retrieve stories: {e}") from e

    async def update_story(self, story_id: UUID, story_in: StoryUpdate) -> StoryInDB:
        """Update an existing story record.

        Raises:
            RecordNotFoundError: If the story does not exist.
            DatabaseError: On unexpected database failures.
        """
        update_data = story_in.model_dump(exclude_unset=True)
        if not update_data:
            # Nothing to update, just return the current record
            return await self.get_story(story_id)

        try:
            # Supabase update will return empty data if no rows matched
            response = self.client.table(self.table).update(update_data).eq("id", str(story_id)).execute()
            
            if not response.data:
                raise RecordNotFoundError(entity="Story", entity_id=str(story_id))
                
            logger.info("Updated story %s", story_id)
            return StoryInDB.model_validate(response.data[0])
        except RecordNotFoundError:
            raise
        except Exception as e:
            logger.error("Failed to update story %s: %s", story_id, e)
            raise DatabaseError(f"Failed to update story: {e}") from e

    async def delete_story(self, story_id: UUID) -> None:
        """Delete a story by its ID.

        Raises:
            RecordNotFoundError: If the story does not exist.
            DatabaseError: On unexpected database failures.
        """
        try:
            response = self.client.table(self.table).delete().eq("id", str(story_id)).execute()
            
            if not response.data:
                raise RecordNotFoundError(entity="Story", entity_id=str(story_id))
                
            logger.info("Deleted story %s", story_id)
        except RecordNotFoundError:
            raise
        except Exception as e:
            logger.error("Failed to delete story %s: %s", story_id, e)
            raise DatabaseError(f"Failed to delete story: {e}") from e

    async def search_story(self, query: str, limit: int = 20) -> list[StoryBrief]:
        """Search stories by keywords or text.

        Currently performs an ILIKE search across multiple text fields.
        Phase 03 might upgrade this to vector search (pgvector).
        """
        try:
            # Using Supabase's or syntax for basic search
            search_filter = (
                f"title.ilike.%{query}%, "
                f"speaker_name.ilike.%{query}%, "
                f"summary.ilike.%{query}%, "
                f"district.ilike.%{query}%, "
                f"village.ilike.%{query}%"
            )
            response = (
                self.client.table(self.table)
                .select("id, title, speaker_name, village, district, language, image_url, created_at")
                .or_(search_filter)
                .order("created_at", desc=True)
                .limit(limit)
                .execute()
            )
            return [StoryBrief.model_validate(item) for item in response.data]
        except Exception as e:
            logger.error("Failed to search stories with query '%s': %s", query, e)
            raise DatabaseError(f"Failed to search stories: {e}") from e

    async def story_exists(self, story_id: UUID) -> bool:
        """Check if a story exists by its ID."""
        try:
            response = (
                self.client.table(self.table)
                .select("id", count="exact")
                .eq("id", str(story_id))
                .execute()
            )
            return response.count is not None and response.count > 0
        except Exception as e:
            logger.error("Failed to check if story %s exists: %s", story_id, e)
            raise DatabaseError(f"Failed to check story existence: {e}") from e
