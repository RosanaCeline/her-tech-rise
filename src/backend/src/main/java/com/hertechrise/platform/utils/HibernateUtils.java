package com.hertechrise.platform.utils;

import jakarta.persistence.EntityManager;
import org.hibernate.Session;

public class HibernateUtils {
    public static void enableDeletedFilter(EntityManager entityManager) {
        Session session = entityManager.unwrap(Session.class);
        session.enableFilter("deletedFilter").setParameter("isDeleted", false);
    }
}

