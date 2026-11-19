from typing import List, Optional, Dict, Any
from ...database.Models import Project, Episode, Scene, Character
from ...providers import TextProvider, ProviderFactory


class ScriptAnalysisService:
    """Service for analyzing scripts and extracting scenes and characters.
    
    Uses AI providers to parse screenplay scripts and extract structured data.
    Implements the script pipeline step: "Analyze script" -> "Extract scenes" -> "Extract characters"
    """
    
    def __init__(self, text_provider: TextProvider = None):
        self.text_provider = text_provider or ProviderFactory.create_text_provider()
    
    async def analyze_script(self, script: str, project_id: str = None) -> Dict[str, Any]:
        """Analyze a complete screenplay script.
        
        Returns structured analysis including:
        - Genre and target audience
        - Act structure
        - Character list
        - Scene list
        - Pacing and strengths/weaknesses
        - Improvement suggestions
        
        Args:
            script: The raw script text
            project_id: Optional project ID for context
            
        Returns:
            Dictionary with analysis results
        """
        analysis = await self.text_provider.analyze_script(script)
        
        # Enhance with project context if available
        if project_id:
            analysis['project_id'] = project_id
            analysis['script_length'] = len(script)
            analysis['script_word_count'] = len(script.split())
        
        return analysis
    
    async def extract_scenes(self, script: str) -> List[Dict[str, Any]]:
        """Extract all scenes from a screenplay script.
        
        For each scene, extracts:
        - Scene number/heading (INT. / EXT.)
        - Location
        - Time of day
        - Brief description of action
        - Characters present
        
        Args:
            script: The raw script text
            
        Returns:
            List of scene dictionaries
        """
        scenes = await self.text_provider.extract_scenes(script)
        
        # Validate and normalize scene data
        normalized_scenes = []
        for i, scene in enumerate(scenes):
            if isinstance(scene, dict):
                normalized_scene = {
                    'scene_number': scene.get('scene_number', i + 1),
                    'location': scene.get('location', ''),
                    'time_of_day': scene.get('time_of_day', ''),
                    'description': scene.get('description', ''),
                    'characters_present': scene.get('characters_present', []),
                }
                normalized_scenes.append(normalized_scene)
        
        return normalized_scenes
    
    async def extract_characters(self, script: str) -> List[Dict[str, Any]]:
        """Extract all character names and descriptions from a screenplay script.
        
        For each character, extracts:
        - Character name
        - Role/description
        - First appearance scene (estimated)
        - Screen time prediction
        
        Args:
            script: The raw script text
            
        Returns:
            List of character dictionaries
        """
        characters = await self.text_provider.extract_characters(script)
        
        # Validate and normalize character data
        normalized_characters = []
        for i, char in enumerate(characters):
            if isinstance(char, dict):
                normalized_char = {
                    'name': char.get('name', f'Character {i + 1}'),
                    'role': char.get('role', ''),
                    'first_appearance': char.get('first_appearance', ''),
                    'screen_time_estimate': char.get('screen_time_estimate', ''),
                }
                normalized_characters.append(normalized_char)
        
        return normalized_characters
    
    async def full_script_analysis(self, script: str, project_id: str = None) -> Dict[str, Any]:
        """Perform full script analysis: extract scenes and characters.
        
        This is the main entry point for the script pipeline step:
        "Analyze script" -> "Extract scenes" -> "Extract characters"
        
        Args:
            script: The raw script text
            project_id: Optional project ID
            
        Returns:
            Dictionary with complete analysis including scenes and characters
        """
        # Run extractions in parallel for efficiency
        analysis_task = self.analyze_script(script, project_id)
        scenes_task = self.extract_scenes(script)
        characters_task = self.extract_characters(script)
        
        analysis, scenes, characters = await analysis_task, await scenes_task, await characters_task
        
        return {
            'analysis': analysis,
            'scenes': scenes,
            'characters': characters,
            'script': script,
            'extraction_summary': {
                'total_scenes': len(scenes),
                'total_characters': len(characters),
                'has_script_length': 'script_length' in analysis,
            }
        }


# Convenience function for fast instantiation
def create_script_analysis_service(provider_name: str = "openrouter") -> ScriptAnalysisService:
    """Create a ScriptAnalysisService with specified text provider.
    
    Args:
        provider_name: Name of the AI provider to use
        
    Returns:
        Configured ScriptAnalysisService instance
    """
    text_provider = ProviderFactory.create_text_provider(provider_name)
    return ScriptAnalysisService(text_provider)