Task Distribution Test
======================

Cases
-----

### Case #1
If:
- we have limit of 4 workers
- client comes in with 4 tasks

Then:
- each task must be assigned to a separate worker

### Case #2
If:
- we have a limit of 4 workers
- client 1 comes in with 8 tasks
- client 2 comes in with 1 task

Then: 
- client 1 will see 4 of their tasks executed
- client 2 will see their task executed
- client 1 will see 4 of their tasks executed

### Case #3
If:
- we have a limit of 4 workers
- client 1 comes in with 8 tasks
- client 2 comes in with 4 task

Then:
- client 1 will see 4 of their tasks executed
- client 2 will see their task executed
- client 1 will see their task executed
- client 2 will see their task executed
- client 1 will see their task executed
- client 2 will see their task executed
- client 1 will see their task executed
- client 2 will see their task executed
- client 1 will see their task executed

Pseudo-code
-----------

SELECT tasks
WHERE
    task.customerId not in (
        SELECT customerId
        FROM tasks
        WHERE status === "RUNNING"
    )
GROUP BY task.customerId
ORDER BY createdAt
TAKING 1
