
## Recuperation du projet

```bash
git clone
```

## Run server 

```bash
npm run dev

```

## Lancer les migrations

```bash
npx  prisma migrate dev
```


## Créer une nouvelle migration

```bash
npx prisma migrate dev --name nom de la migration
```

## Remplir la base de données ! 

```bash
npx prisma db seed

```

## Se connecter à stripe en local cli

```bash
stripe login
```

## Lancer le serveur stripe en local

```bash
stripe listen --forward-to http://localhost:3000/api/webhook
```

