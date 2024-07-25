import React from 'react';
import LinkItem from './LinkItem';
import './LinkList.css';

function LinkList({ links, onMarkAsRead, onDelete, categoryColorMap, onLinkOpen, isAdmin }) {
  if (!links || links.length === 0) {
    return <div className="text-center p-4">No links available</div>;
  }

  return (
    <div className="link-list-container">
      {links.map((link) => (
        <div key={link.id} className="link-item-wrapper">
          <LinkItem
            link={link}
            onMarkAsRead={onMarkAsRead}
            onDelete={onDelete}
            categoryColorMap={categoryColorMap}
            onLinkOpen={onLinkOpen}
            isAdmin={isAdmin}
          />
        </div>
      ))}
    </div>
  );
}

export default LinkList;
