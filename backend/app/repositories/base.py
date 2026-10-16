from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional

class CaseRepository(ABC):
    @abstractmethod
    def list(
        self,
        status: Optional[str] = None,
        category: Optional[str] = None,
        priority: Optional[str] = None,
        date_range: Optional[str] = None,
        query: Optional[str] = None,
        sort_by: Optional[str] = "date_desc",
    ) -> List[Dict[str, Any]]:
        pass

    @abstractmethod
    def get_by_id(self, case_id: str) -> Optional[Dict[str, Any]]:
        pass

    @abstractmethod
    def create(self, case_data: Dict[str, Any]) -> Dict[str, Any]:
        pass

    @abstractmethod
    def update(self, case_id: str, case_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        pass

    @abstractmethod
    def count(self) -> int:
        pass
