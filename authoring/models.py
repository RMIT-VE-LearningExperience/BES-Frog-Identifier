"""Authoring document format; all coordinates are percentages of the full image."""
import re
from pathlib import PurePosixPath
from typing import Annotated, Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator

Percent = Annotated[float, Field(ge=0, le=100)]


class Model(BaseModel):
    model_config = ConfigDict(extra="forbid")


class Hotspot(Model):
    id: str = Field(pattern=r"^[a-z0-9-]{1,60}$")
    x: Percent = 50
    y: Percent = 50


class Scene(Model):
    id: str = Field(pattern=r"^[a-z0-9-]{1,60}$")
    name: str = Field(default="Wetland edge", min_length=1, max_length=150)
    photo: str = ""
    ambient_audio: str = ""
    map_x: Percent = 50
    map_y: Percent = 50
    hotspots: list[Hotspot] = Field(default_factory=list, max_length=30)


class Frog(Model):
    name: str = Field(default="", max_length=150)
    scientific_name: str = Field(default="", max_length=150)
    description: str = Field(default="", max_length=6000)
    habitat: str = Field(default="", max_length=3000)
    hints: list[str] = Field(default_factory=list, max_length=10)
    calling: list[Annotated[int, Field(ge=0, le=3)]] = Field(default_factory=lambda: [0] * 12, min_length=12, max_length=12)
    photo: str = ""
    call_audio: str = ""
    audio_credit: str = Field(default="", max_length=1000)


class Draft(Model):
    id: str = Field(pattern=r"^[a-f0-9]{12}$")
    name: str = Field(default="New Victorian reserve", min_length=1, max_length=150)
    map_image: str = ""
    map_alt: str = Field(default="Illustrative wetland reserve map; not to scale.", max_length=1000)
    geography_reference: str = ""
    pin_x: Percent = 50
    pin_y: Percent = 50
    frog: Frog = Field(default_factory=Frog)
    sources: list[str] = Field(default_factory=list, max_length=30)
    notes: str = Field(default="", max_length=6000)
    reviewed: bool = False
    scenes: list[Scene] = Field(default_factory=list, max_length=20)
    revision: int = Field(default=0, ge=0)

    @field_validator("scenes")
    @classmethod
    def unique_ids(cls, scenes):
        ids = [s.id for s in scenes]
        if len(ids) != len(set(ids)):
            raise ValueError("Scene IDs must be unique")
        for scene in scenes:
            ids = [h.id for h in scene.hotspots]
            if len(ids) != len(set(ids)):
                raise ValueError("Hotspot IDs must be unique within each scene")
        return scenes


class SaveDraft(Model):
    draft: Draft


class GenerateRequest(Model):
    target: Literal["frog", "map", "scene"]
    scene_id: str | None = None
    prompt: str = Field(default="", max_length=5000)


def asset_path(value: str) -> str:
    if not value:
        return value
    p = PurePosixPath(value)
    if p.is_absolute() or ".." in p.parts or not value.startswith("assets/") or "\\" in value:
        raise ValueError("Media must be an asset inside this repository")
    if not re.fullmatch(r"[a-zA-Z0-9 /_.()-]+", value):
        raise ValueError("Unsupported characters in media path")
    return value
