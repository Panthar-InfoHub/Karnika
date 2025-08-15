import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'

const ErrorCard = ({ error, title }: { error: Error, title: string }) => {
    return (
        <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight capitalize">{title}</h2>
            <Card>
                <CardHeader>
                    <CardTitle>Something went wrong!</CardTitle>
                    <CardDescription className="text-destructive">
                        Failed to load {title}: {error.message}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Please try refreshing the page or contact support if the problem persists.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}

export default ErrorCard