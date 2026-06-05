import ResourceCard from "./ResourceCard";

function ResourceList({ resources, onDeleteRequest, onToggleCollection, onEditResource, onDeleteResource }) {
  if (!resources.length) {
    return (
      <div className="resource-list">
        <div className="empty-state">
          <div className="empty-state__icon">📚</div>
          <h3 className="empty-state__title">No resources found</h3>
          <p className="empty-state__text">Try adjusting your filters or add a new resource.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="resource-list">
      {resources.map((resource) => (
        <ResourceCard
          key={resource.id}
          resource={resource}
          onDeleteRequest={onDeleteRequest}
          onToggleCollection={onToggleCollection}
          onEditResource={onEditResource}
          onDeleteResource={onDeleteResource}
        />
      ))}
    </div>
  );
}

export default ResourceList;
